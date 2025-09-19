// src/lib/firebaseHelpers.ts
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
  serverTimestamp,
  DocumentData,
  getDoc,
  getDocs,
  Timestamp, // Add this import
} from "firebase/firestore";
import { db, storage } from "./firebase";

// Helper function to check if Firebase is initialized
const isFirebaseInitialized = () => {
  if (!db || !storage) {
    console.warn(
      "Firebase not initialized. Please check your environment variables."
    );
    return false;
  }
  return true;
};
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export type ProjectDoc = {
  slug: string;
  title: string;
  year: number;
  category: "Full-Stack" | "Frontend" | "API";
  summary: string;
  description?: string;
  problem?: string;
  solution?: string;
  highlights?: string[];
  learnings?: string[];
  tags: string[];
  stack: string[];
  links: { demo: string; code: string };
  images?: { src: string; alt: string }[];
  imageUrl?: string;
  imagePath?: string;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
};

export type BlogDoc = {
  slug: string;
  title: string;
  summary: string;
  content?: string;
  date: string;
  tags: string[];
  readingTime: string;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
  imageUrl?: string;
  imagePath?: string;
  images?: { src: string; alt: string }[];
};

const projectsCol = db ? collection(db, "projects") : null;
const blogsCol = db ? collection(db, "blogs") : null;

/** Upload a file to storage; returns { url, path } */
export async function uploadFile(file: File, folder = "uploads") {
  if (!isFirebaseInitialized()) {
    throw new Error(
      "Firebase not initialized. Please check your environment variables."
    );
  }

  const safeName = file.name.replace(/\s+/g, "-");
  const path = `${folder}/${Date.now()}-${safeName}`;
  const ref = storageRef(storage, path);

  // Attach contentType to avoid ambiguous uploads and reduce preflight surprises
  const task = uploadBytesResumable(ref, file, {
    contentType: file.type || "application/octet-stream",
  });

  await new Promise<void>((resolve, reject) => {
    task.on(
      "state_changed",
      undefined,
      (err) => reject(err),
      () => resolve()
    );
  });

  const url = await getDownloadURL(ref);
  return { url, path };
}

/** Delete file from storage by path */
export async function deleteFile(path: string) {
  if (!path) return;
  if (!isFirebaseInitialized()) {
    console.warn("Firebase not initialized. Cannot delete file.");
    return;
  }

  try {
    const ref = storageRef(storage, path);
    await deleteObject(ref);
  } catch (err: unknown) {
    console.warn("deleteFile error:", err);
  }
}

/** Projects — real-time subscription */
export function subscribeProjects(
  onUpdate: (items: { id: string; data: ProjectDoc }[]) => void
) {
  if (!isFirebaseInitialized() || !projectsCol) {
    onUpdate([]);
    return () => {};
  }

  const q = query(projectsCol, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({
      id: d.id,
      data: d.data() as ProjectDoc,
    }));
    onUpdate(items);
  });
}

/** Blogs — real-time subscription */
export function subscribeBlogs(
  onUpdate: (items: { id: string; data: BlogDoc }[]) => void
) {
  if (!isFirebaseInitialized() || !blogsCol) {
    onUpdate([]);
    return () => {};
  }

  const q = query(blogsCol, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({
      id: d.id,
      data: d.data() as BlogDoc,
    }));
    onUpdate(items);
  });
}

/** Add project */
export async function addProject(
  data: Omit<ProjectDoc, "createdAt" | "updatedAt">
) {
  const payload = {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const ref = await addDoc(projectsCol, payload);
  return ref.id;
}

/** Update project */
export async function updateProject(
  id: string,
  data: Partial<Omit<ProjectDoc, "createdAt" | "updatedAt">>
) {
  const ref = doc(db, "projects", id);
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  } as DocumentData);
}

/** Delete project */
export async function removeProject(id: string, data?: ProjectDoc) {
  if (data?.imagePath) {
    await deleteFile(data.imagePath);
  }
  const ref = doc(db, "projects", id);
  await deleteDoc(ref);
}

/** Add blog */
export async function addBlog(data: Omit<BlogDoc, "createdAt" | "updatedAt">) {
  const payload = {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const ref = await addDoc(blogsCol, payload);
  return ref.id;
}

/** Update blog */
export async function updateBlog(
  id: string,
  data: Partial<Omit<BlogDoc, "createdAt" | "updatedAt">>
) {
  const ref = doc(db, "blogs", id);
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  } as DocumentData);
}

/** Delete blog */
export async function removeBlog(id: string) {
  const ref = doc(db, "blogs", id);
  await deleteDoc(ref);
}

/** Get a single project */
export async function getProject(id: string): Promise<ProjectDoc | null> {
  try {
    const docRef = doc(db, "projects", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as ProjectDoc;
    }
    return null;
  } catch (error) {
    console.error("Error getting project:", error);
    throw error;
  }
}

/** Get a single blog */
export async function getBlog(id: string): Promise<BlogDoc | null> {
  try {
    const docRef = doc(db, "blogs", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as BlogDoc;
    }
    return null;
  } catch (error) {
    console.error("Error getting blog:", error);
    throw error;
  }
}

/** Get a single blog by slug */
export async function getBlogBySlug(
  slug: string
): Promise<{ id: string; data: BlogDoc } | null> {
  const q = query(blogsCol, where("slug", "==", slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, data: d.data() as BlogDoc };
}

/** Get a single project by slug */
export async function getProjectBySlug(
  slug: string
): Promise<{ id: string; data: ProjectDoc } | null> {
  const q = query(projectsCol, where("slug", "==", slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, data: d.data() as ProjectDoc };
}
