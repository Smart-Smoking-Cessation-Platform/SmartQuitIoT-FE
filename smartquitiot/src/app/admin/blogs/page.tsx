"use client";
import React, { useState } from "react";
import { Row, Col, Button, message } from "antd";
import BlogCard from "@/components/cards/blog-card";
import BlogDetailModal from "@/components/modals/blogs/blog-modal";
import DeleteConfirmModal from "@/components/modals/common/delete-confirm-modal";
import BlogFormModal from "@/components/modals/blogs/blog-form-modal";
import { Blog } from "@/types/blog";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([
    {
      id: "1",
      title: "Blog 1",
      description: "Short description blog 1",
      thumbnail: "https://picsum.photos/400/200?random=1",
      likes: 120,
      content: "Content of blog 1...",
      createdAt: "2025-09-27",
    },
    {
      id: "2",
      title: "Blog 2",
      description: "Short description blog 2",
      thumbnail: "https://picsum.photos/400/200?random=2",
      likes: 90,
      content: "Content of blog 2...",
      createdAt: "2025-09-25",
    },
    {
      id: "3",
      title: "Blog 3",
      description: "Short description blog 3",
      thumbnail: "https://picsum.photos/400/200?random=3",
      likes: 150,
      content: "Content of blog 3...",
      createdAt: "2025-09-23",
    },
    {
      id: "4",
      title: "Blog 4",
      description: "Short description blog 4",
      thumbnail: "https://picsum.photos/400/200?random=4",
      likes: 75,
      content: "Content of blog 4...",
      createdAt: "2025-09-20",
    },
  ]);

  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  // Delete
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Blog | null>(null);

  // Add/Edit
  const [formVisible, setFormVisible] = useState(false);
  const [formTarget, setFormTarget] = useState<Blog | null>(null);

  // antd message hook
  const [messageApi, contextHolder] = message.useMessage();

  const handleView = (blog: Blog) => {
    setSelectedBlog(blog);
    setDetailVisible(true);
  };

  const handleEdit = (blog: Blog) => {
    setFormTarget(blog);
    setFormVisible(true);
  };

  const handleDeleteClick = (blog: Blog) => {
    setDeleteTarget(blog);
    setDeleteVisible(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      setBlogs(blogs.filter((b) => b.id !== deleteTarget.id));
      messageApi.success(`Deleted blog: ${deleteTarget.title}`);
    }
    setDeleteVisible(false);
  };

  const handleSaveForm = (values: Partial<Blog>) => {
    if (formTarget) {
      // Edit
      const updated = { ...formTarget, ...values };
      setBlogs((prev) =>
        prev.map((b) => (b.id === formTarget.id ? updated : b))
      );
      messageApi.success("Blog updated successfully");
    } else {
      // Add new
      const newBlog: Blog = {
        id: Date.now().toString(),
        likes: 0,
        createdAt: new Date().toISOString(),
        content: values.content || "",
        description: values.description || "",
        thumbnail: values.thumbnail || "",
        title: values.title || "Untitled",
      };
      setBlogs((prev) => [...prev, newBlog]);
      messageApi.success("Blog added successfully");
    }
    setFormVisible(false);
  };

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          background: "#fff",
          padding: "16px 24px",
          borderRadius: 8,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ margin: 0 }}>Manage Blogs</h1>
        <Button
          type="primary"
          onClick={() => {
            setFormTarget(null);
            setFormVisible(true);
          }}
        >
          Add Blog
        </Button>
      </div>

      {/* List */}
      <Row gutter={[16, 16]}>
        {blogs.map((blog) => (
          <Col key={blog.id} xs={24} sm={12} md={8} lg={6}>
            <BlogCard
              title={blog.title}
              thumbnail={blog.thumbnail || ""}
              description={blog.description}
              likes={blog.likes}
              onView={() => handleView(blog)}
              onEdit={() => handleEdit(blog)}
              onDelete={() => handleDeleteClick(blog)}
            />
          </Col>
        ))}
      </Row>

      {/* Detail Modal */}
      <BlogDetailModal
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
        blog={selectedBlog}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        visible={deleteVisible}
        title="Confirm Delete Blog"
        content={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        okText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteVisible(false)}
      />

      {/* Add/Edit Modal */}
      <BlogFormModal
        visible={formVisible}
        blog={formTarget}
        onCancel={() => setFormVisible(false)}
        onSave={handleSaveForm}
      />
    </div>
  );
}
