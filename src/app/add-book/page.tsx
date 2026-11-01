'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, BookPlus, Loader2, User } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const AddBook = () => {
  const router = useRouter();

  const { 
    data: session, 
    isPending,
  } = authClient.useSession();

  const user = session?.user;

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    published_year: new Date().getFullYear(),
    price: "",
    rating: 4.5,
    in_stock: true,
    cover_image: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        in_stock: Boolean(formData.in_stock),
        cover_image: finalImageUrl,
        description: formData.description,
        user_name: user?.name || "Anonymous",
        user_email: user?.email || "",
      };

      console.log("Submitting Book Payload:", bookPayload);

      const response = await fetch("http://localhost:8000/all-books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookPayload),
      });

      const final = await response.json();

      if (final.acknowledged || response.ok) {
        router.push("/all-books");
      }
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: "",
      author: "",
      category: "",
      published_year: new Date().getFullYear(),
      price: "",
      rating: 4.5,
      in_stock: true,
      cover_image: "",
      description: "",
    });
    setImageFile(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 text-slate-800">
      <h1 className="text-3xl font-light tracking-wide text-slate-900 mb-8 max-w-2xl mx-auto">
        Add New Book
      </h1>

      <Card className="max-w-2xl mx-auto border-slate-100 shadow-sm bg-white rounded-lg">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Added by / Current User Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2 border-b border-slate-100">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500">
                  Added By (User)
                </Label>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-700">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="truncate">
                    {isPending ? "Loading..." : user?.name || "Not signed in"}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500">
                  User Email
                </Label>
                <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-700 truncate">
                  {isPending ? "Loading..." : user?.email || "No email available"}
                </div>
              </div>
            </div>

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
                placeholder="e.g., Beyond the Horizon"
                className="bg-slate-50 border-slate-200 focus-visible:ring-1 focus-visible:ring-teal-500 text-sm h-10"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="e.g., Maya Lin"
                  className="bg-slate-50 border-slate-200 focus-visible:ring-1 focus-visible:ring-teal-500 text-sm h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="category" className="text-xs font-semibold text-slate-700">
                  Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => handleSelectChange(val ?? "")}
                >
                  <SelectTrigger className="bg-slate-50 border-slate-200 focus:ring-1 focus:ring-teal-500 text-sm h-10">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fiction">Fiction</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                    <SelectItem value="Kids">Kids</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="e.g., 11.50"
                  className="bg-slate-50 border-slate-200 focus-visible:ring-1 focus-visible:ring-teal-500 text-sm h-10 placeholder:text-slate-400"
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
                  placeholder="e.g., 2018"
                  className="bg-slate-50 border-slate-200 focus-visible:ring-1 focus-visible:ring-teal-500 text-sm h-10 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cover_image" className="text-xs font-semibold text-slate-700">
                Book Image (Upload)
              </Label>
              <Input
                id="cover_image"
                type="file"
                accept="image/*"
                required
                onChange={handleFileChange}
                className="bg-slate-50 border-slate-200 focus-visible:ring-1 focus-visible:ring-teal-500 text-sm h-10 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
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
                placeholder="A brief synopsis or description of the book..."
                className="bg-slate-50 border-slate-200 focus-visible:ring-1 focus-visible:ring-teal-500 text-sm min-h-[120px] resize-none placeholder:text-slate-400"
              />
            </div>

            <div className="flex justify-end items-center gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isSubmitting}
                className="border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600 font-medium px-4 h-10 gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting || isPending || !user}
                className="bg-[#0097b2] hover:bg-[#00839b] text-white font-medium px-5 h-10 gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <BookPlus className="w-4 h-4" />
                    Add Book
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBook;