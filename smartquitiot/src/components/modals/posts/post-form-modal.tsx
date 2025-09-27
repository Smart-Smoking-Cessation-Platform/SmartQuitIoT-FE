"use client";
import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

interface Post {
  id: string;
  content: string;
  media?: string;
}

interface PostFormModalProps {
  visible: boolean;
  post: Post | null;
  onCancel: () => void;
  onSave: (values: Partial<Post>) => void;
}

const PostFormModal: React.FC<PostFormModalProps> = ({ visible, post, onCancel, onSave }) => {
  const [form] = Form.useForm();
  const [fileUrl, setFileUrl] = useState<string | undefined>(post?.media);

  useEffect(() => {
    form.setFieldsValue({
      content: post?.content || "",
    });
    setFileUrl(post?.media);
  }, [post, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    onSave({ ...values, media: fileUrl });
  };

  return (
    <Modal
      open={visible}
      title={post ? "Edit Post" : "Add Post"}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Save"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Content"
          name="content"
          rules={[{ required: true, message: "Please input post content!" }]}
        >
          <Input.TextArea rows={4} placeholder="What's on your mind?" />
        </Form.Item>

        <Form.Item label="Media (Image/Video)">
          <Upload
            listType="picture"
            beforeUpload={(file) => {
              const url = URL.createObjectURL(file);
              setFileUrl(url);
              return false; // prevent auto upload
            }}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
          {fileUrl && (
            <div style={{ marginTop: 12 }}>
              {fileUrl.endsWith(".mp4") ? (
                <video width="100%" controls>
                  <source src={fileUrl} type="video/mp4" />
                </video>
              ) : (
                <img src={fileUrl} alt="preview" style={{ width: "100%", borderRadius: 4 }} />
              )}
            </div>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PostFormModal;
