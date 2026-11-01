'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IBook } from "@/app/all-books/[bookId]/page";
import { authClient } from "@/lib/auth-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Loader2, Save, X } from "lucide-react";

interface EditButtonsProps {
  book: IBook;
  onBookUpdated?: (updatedBook: IBook) => void;
}

const CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"] as const;

const getInitialFormData = (book: IBook) => ({
  title: book?.title ?? "",
  author: book?.author ?? "",
  category: book?.category ?? "",
  published_year: book?.published_year ?? new Date().getFullYear(),
  price: book?.price !== undefined ? String(book.price) : "",
  rating: book?.rating ?? 4.5,
  cover_image: book?.cover_image ?? "",
  description: book?.description ?? "",
});

const EditButtons = ({ book, onBookUpdated }: EditButtonsProps) => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState(() => getInitialFormData(book));

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setFormData(getInitialFormData(book));
      setImageFile(null);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadToImgbb = async (file: File): Promise<string> => {
    const data = new FormData();
    data.append("image", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: data,
    });

    const resData = await res.json();
    if (!res.ok) {
      throw new Error(resData.error || "Failed to upload image.");
    }

    return resData.url;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;

    setIsSubmitting(true);

    try {
      let finalImageUrl = formData.cover_image;

      if (imageFile) {
        finalImageUrl = await uploadToImgbb(imageFile);
      }

      const bookPayload = {
        title: formData.title,
        author: formData.author,
        category: formData.category,
        published_year: Number(formData.published_year),
        rating: Number(formData.rating),
        price: Number(formData.price),
        cover_image: finalImageUrl,
        description: formData.description,
      };

      const res = await fetch(
        `http://localhost:8000/my-books/${encodeURIComponent(user.email)}/${book._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookPayload),
        }
      );

      const editedData = await res.json();

      if (res.ok || editedData.acknowledged) {
        setIsOpen(false);
        setImageFile(null);
        if (onBookUpdated) {
          onBookUpdated({ ...book, ...bookPayload });
        }
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update book:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOwner = user?.email && (!book?.user_email || book.user_email === user.email);

  if (!isPending && !isOwner) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-transparent px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-100 gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400">
        <Pencil className="w-3.5 h-3.5" />
        Edit
      </DialogTrigger>

      <DialogContent className="w-[95vw] sm:w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-slate-900">
            Edit Book Details
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleUpdate} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-semibold text-slate-700">
              Book Title
            </Label>
            <Input
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="bg-slate-50 border-slate-200 focus-visible:ring-teal-500 text-sm h-10 w-full"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="author" className="text-xs font-semibold text-slate-700">
                Author Name
              </Label>
              <Input
                id="author"
                name="author"
                required
                value={formData.author}
                onChange={handleChange}
                className="bg-slate-50 border-slate-200 focus-visible:ring-teal-500 text-sm h-10 w-full"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category" className="text-xs font-semibold text-slate-700">
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(val: string | null) =>
                  setFormData((prev) => ({ ...prev, category: val ?? "" }))
                }
              >
                <SelectTrigger className="bg-slate-50 border-slate-200 focus:ring-teal-500 text-sm h-10 w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="price" className="text-xs font-semibold text-slate-700">
                Price (USD)
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={handleChange}
                className="bg-slate-50 border-slate-200 focus-visible:ring-teal-500 text-sm h-10 w-full"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="published_year" className="text-xs font-semibold text-slate-700">
                Published Year
              </Label>
              <Input
                id="published_year"
                name="published_year"
                type="number"
                value={formData.published_year}
                onChange={handleChange}
                className="bg-slate-50 border-slate-200 focus-visible:ring-teal-500 text-sm h-10 w-full"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cover_image" className="text-xs font-semibold text-slate-700">
              Replace Book Image (Optional)
            </Label>
            <Input
              id="cover_image"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="bg-slate-50 border-slate-200 focus-visible:ring-teal-500 text-sm h-10 w-full file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
            />
          </div>

     
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-semibold text-slate-700">
              Short Description
            </Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              required
              value={formData.description}
              onChange={handleChange}
              className="bg-slate-50 border-slate-200 focus-visible:ring-teal-500 text-sm min-h-[100px] resize-none break-all w-full"
            />
          </div>
          <div className="flex justify-end items-center gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
              className="border-slate-300 text-slate-600 hover:bg-slate-100 h-9 px-4 gap-1.5"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || isPending || !user}
              className="bg-[#0097b2] hover:bg-[#00839b] text-white font-medium h-9 px-5 gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditButtons;