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
  serverTimestamp,
  DocumentData,
  getDoc, // Add this import
} from "firebase/firestore";
import { db, storage } from "./firebase";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export type ProjectDoc = {
  title: string;
  summary?: string;
  description?: string;
  year?: number;
  category?: string;
  tags?: string[];
  stack?: string[];
  links?: {
    // Add links property
    demo?: string;
    code: string;
  };
  imageUrl?: string;
  imagePath?: string; // storage path for deletion
  createdAt?: import("firebase/firestore").Timestamp | null;
};

export type BlogDoc = {
  title: string;
  summary?: string;
  content?: string;
  date?: string;
  tags?: string[];
  readingTime?: string;
  createdAt?: import("firebase/firestore").Timestamp | null;
};

const projectsCol = collection(db, "projects");
const blogsCol = collection(db, "blogs");

/** Upload a file to storage; returns { url, path } */
export async function uploadFile(file: File, folder = "uploads") {
  const path = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const ref = storageRef(storage, path);
  await uploadBytes(ref, file);
  const url = await getDownloadURL(ref);
  return { url, path };
}

/** Delete file from storage by path */
export async function deleteFile(path: string) {
  if (!path) return;
  try {
    const ref = storageRef(storage, path);
    await deleteObject(ref);
  } catch (err: unknown) {
    // handle safely — stringify for logs
    console.warn(
      "deleteFile error:",
      typeof err === "string" ? err : JSON.stringify(err)
    );
  }
}

/** Projects — real-time subscription */
export function subscribeProjects(
  onUpdate: (items: { id: string; data: ProjectDoc }[]) => void
) {
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
export async function addProject(data: ProjectDoc) {
  const payload = { ...data, createdAt: serverTimestamp() };
  const ref = await addDoc(projectsCol, payload);
  return ref.id;
}

/** Update project */
export async function updateProject(id: string, data: Partial<ProjectDoc>) {
  const ref = doc(db, "projects", id);
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  } as DocumentData);
}

/** Delete project */
export async function removeProject(id: string, data?: ProjectDoc) {
  // delete storage file if present
  if (data?.imagePath) {
    await deleteFile(data.imagePath);
  }
  const ref = doc(db, "projects", id);
  await deleteDoc(ref);
}

/** Add blog */
export async function addBlog(data: BlogDoc) {
  const payload = { ...data, createdAt: serverTimestamp() };
  const ref = await addDoc(blogsCol, payload);
  return ref.id;
}

/** Update blog */
export async function updateBlog(id: string, data: Partial<BlogDoc>) {
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

// Add these to your existing firebaseHelpers.ts

// Get a single project
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

// Get a single blog
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
