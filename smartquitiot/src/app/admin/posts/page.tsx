"use client";
import React, { useState } from "react";
import { Row, Col, Button, message } from "antd";
import { FileImageOutlined, VideoCameraOutlined } from "@ant-design/icons";
import DeleteConfirmModal from "@/components/modals/common/delete-confirm-modal";
import PostFormModal from "@/components/modals/posts/post-form-modal";
import PostDetailModal from "@/components/modals/posts/post-detail-modal";
import { Post } from "@/types/post";
import { Comment } from "@/types/comment";

export default function ManagePostsPage() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: "User 1",
      content: "This is a sample post 1",
      media: "https://picsum.photos/400/200?random=1",
      likes: 12,
      comments: [{ id: "c1", author: "Alice", content: "Nice post!" }],
      createdAt: "2025-09-27",
    },
    {
      id: "2",
      author: "User 2",
      content: "Another post with video",
      media: "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4",
      likes: 5,
      comments: [],
      createdAt: "2025-09-25",
    },
  ]);

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);

  const [formVisible, setFormVisible] = useState(false);
  const [formTarget, setFormTarget] = useState<Post | null>(null);

  const [messageApi, contextHolder] = message.useMessage();

  const handleView = (post: Post) => {
    setSelectedPost(post);
    setDetailVisible(true);
  };

  const handleEdit = (post: Post) => {
    setFormTarget(post);
    setFormVisible(true);
  };

  const handleDeleteClick = (post: Post) => {
    setDeleteTarget(post);
    setDeleteVisible(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      setPosts(posts.filter((p) => p.id !== deleteTarget.id));
      messageApi.success(`Deleted post by: ${deleteTarget.author}`);
    }
    setDeleteVisible(false);
  };

  const handleSaveForm = (values: Partial<Post>) => {
    if (formTarget) {
      // Edit
      const updated = { ...formTarget, ...values };
      setPosts((prev) => prev.map((p) => (p.id === formTarget.id ? updated : p)));
      messageApi.success("Post updated successfully");
    } else {
      // Add new
      const newPost: Post = {
        id: Date.now().toString(),
        author: "Admin",
        content: values.content || "",
        media: values.media,
        likes: 0,
        comments: [],
        createdAt: new Date().toISOString(),
      };
      setPosts((prev) => [newPost, ...prev]);
      messageApi.success("Post added successfully");
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
        <h1 style={{ margin: 0 }}>Manage Posts</h1>
        <Button
          type="primary"
          onClick={() => {
            setFormTarget(null);
            setFormVisible(true);
          }}
        >
          Add Post
        </Button>
      </div>

      {/* List */}
      <Row gutter={[16, 16]}>
        {posts.map((post) => (
          <Col key={post.id} xs={24} sm={12} md={8} lg={6}>
            <div
              style={{
                border: "1px solid #f0f0f0",
                borderRadius: 8,
                background: "#fff",
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              <div style={{ padding: 12 }}>
                <h3>{post.author}</h3>
                <p>{post.content}</p>
                {post.media && (
                  post.media.endsWith(".mp4") ? (
                    <video width="100%" controls style={{ borderRadius: 4 }}>
                      <source src={post.media} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={post.media}
                      alt="media"
                      style={{ width: "100%", borderRadius: 4 }}
                    />
                  )
                )}
              </div>
              <div
                style={{
                  padding: "0 12px 12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>❤️ {post.likes}</span>
                <span>💬 {post.comments.length}</span>
                <div>
                  <Button size="small" onClick={() => handleView(post)}>
                    View
                  </Button>
                  <Button size="small" onClick={() => handleEdit(post)}>
                    Edit
                  </Button>
                  <Button size="small" danger onClick={() => handleDeleteClick(post)}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Detail Modal */}
      <PostDetailModal
        visible={detailVisible}
        post={selectedPost}
        onClose={() => setDetailVisible(false)}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        visible={deleteVisible}
        title="Confirm Delete Post"
        content={`Are you sure you want to delete this post by "${deleteTarget?.author}"?`}
        okText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteVisible(false)}
      />

      {/* Add/Edit Modal */}
      <PostFormModal
        visible={formVisible}
        post={formTarget}
        onCancel={() => setFormVisible(false)}
        onSave={handleSaveForm}
      />
    </div>
  );
}
