"use client";
import React from "react";
import { Modal, List, Avatar, Button, Space } from "antd";
import { LikeOutlined, CommentOutlined } from "@ant-design/icons";

interface Comment {
  id: string;
  author: string;
  content: string;
}

interface Post {
  id: string;
  author: string;
  content: string;
  media?: string;
  likes: number;
  comments: Comment[];
  createdAt: string;
}

interface PostDetailModalProps {
  visible: boolean;
  post: Post | null;
  onClose: () => void;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ visible, post, onClose }) => {
  if (!post) return null;

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      title={`${post.author} - ${new Date(post.createdAt).toLocaleString()}`}
    >
      <p>{post.content}</p>
      {post.media && (
        post.media.endsWith(".mp4") ? (
          <video width="100%" controls style={{ marginBottom: 12 }}>
            <source src={post.media} type="video/mp4" />
          </video>
        ) : (
          <img src={post.media} alt="media" style={{ width: "100%", marginBottom: 12, borderRadius: 4 }} />
        )
      )}

      <Space style={{ marginBottom: 12 }}>
        <Button icon={<LikeOutlined />}>{post.likes} Like</Button>
        <Button icon={<CommentOutlined />}>{post.comments.length} Comment</Button>
      </Space>

      <List
        dataSource={post.comments}
        header={`${post.comments.length} Comments`}
        renderItem={(comment) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar>{comment.author[0]}</Avatar>}
              title={comment.author}
              description={comment.content}
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default PostDetailModal;
