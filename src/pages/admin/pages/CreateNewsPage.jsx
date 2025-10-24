import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { X, Upload } from "lucide-react";
import { useState } from "react";
import AppBreadcrumb from "@/components/ui/app-breadcrumb";
const CreateNewsPage = () => {
  const [media, setMedia] = useState([]);

  const form = useForm({
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      category: "General",
      author: "",
      status: "draft",
    },
  });

  const handleMediaUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result;
        const mediaType = file.type.startsWith("video") ? "video" : "image";
        setMedia((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            type: mediaType,
            url,
            caption: "",
          },
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveMedia = (mediaId) => {
    setMedia((prev) => prev.filter((m) => m.id !== mediaId));
  };

  const handleUpdateMediaCaption = (mediaId, caption) => {
    setMedia((prev) =>
      prev.map((m) => (m.id === mediaId ? { ...m, caption } : m))
    );
  };

  const handleFormSubmit = (data) => {
    form.reset();
    setMedia([]);
  };

  return (
    <div className="p-6 space-y-6">
      <AppBreadcrumb paths={["admin", "manage-news", "create-news"]} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-6"
        >
          {/* Title and Author Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              rules={{ required: "Title is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Article title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="author"
              rules={{ required: "Author is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author *</FormLabel>
                  <FormControl>
                    <Input placeholder="Author name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Category and Status Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                    >
                      <option>General</option>
                      <option>Product</option>
                      <option>Milestone</option>
                      <option>Finance</option>
                      <option>Technology</option>
                      <option>Other</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Excerpt */}
          <FormField
            control={form.control}
            name="excerpt"
            rules={{ required: "Excerpt is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Excerpt *</FormLabel>
                <FormControl>
                  <textarea
                    placeholder="Brief summary of the article"
                    rows={2}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Content */}
          <FormField
            control={form.control}
            name="content"
            rules={{ required: "Content is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content *</FormLabel>
                <FormControl>
                  <textarea
                    placeholder="Full article content"
                    rows={4}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Media Section */}
          <div className="border-t border-border pt-4">
            <FormLabel className="block mb-3">
              Media (Photos & Videos)
            </FormLabel>
            <div className="mb-4">
              <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, MP4, WebM up to 50MB
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Media Preview */}
            {media.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">
                  Uploaded Media ({media.length})
                </p>
                {media.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded">
                          {item.type.toUpperCase()}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.url.substring(0, 30)}...
                        </span>
                      </div>
                      <Input
                        type="text"
                        placeholder="Add caption (optional)"
                        value={item.caption || ""}
                        onChange={(e) =>
                          handleUpdateMediaCaption(item.id, e.target.value)
                        }
                        className="text-sm"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMedia(item.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Create News
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateNewsPage;
