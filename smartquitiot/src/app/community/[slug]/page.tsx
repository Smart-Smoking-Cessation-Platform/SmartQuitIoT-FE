"use client"

import { notFound, useRouter } from "next/navigation"
import { Container, Heading, Text, VStack, HStack, Image, Tag, Avatar, Divider, Button } from "@chakra-ui/react"
import { getPostBySlug } from "@/data/community"
import { FaHeart, FaArrowLeft } from "react-icons/fa"
import { CommentThread } from "@/components/community/CommentThread"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function PostDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const post = getPostBySlug(params.slug)
  if (!post) return notFound()

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Container maxW="3xl" py={{ base: 6, md: 10 }}>
          <VStack align="stretch" spacing={4}>
            <Button
              leftIcon={<FaArrowLeft />}
              variant="ghost"
              size="sm"
              alignSelf="flex-start"
              onClick={() => router.back()}
              color="gray.600"
              _hover={{ color: "#7AC555", bg: "green.50" }}
            >
              Back to Community
            </Button>
            <Heading size={{ base: "lg", md: "xl" }} color="gray.800">{post.title}</Heading>
            <HStack color="gray.600" spacing={3}>
              <Avatar size="sm" name={post.author.name} src={post.author.avatarUrl} />
              <Text fontSize="sm">By {post.author.name}</Text>
              <Text fontSize="sm">· {new Date(post.createdAt).toLocaleDateString()}</Text>
              <HStack color="red.400" ml="auto">
                <FaHeart />
                <Text fontSize="sm">{post.likes}</Text>
              </HStack>
            </HStack>

            <Image src={post.coverImage} alt={post.title} rounded="md" w="full" h={{ base: 56, md: 80 }} objectFit="cover" />

            <HStack spacing={2} flexWrap="wrap">
              {post.tags.map((tag) => (
                <Tag key={tag} size="sm" colorScheme="green" variant="subtle">{tag}</Tag>
              ))}
            </HStack>

            <Text color="gray.700" fontSize={{ base: "md", md: "lg" }} lineHeight={7}>
              {post.content}
            </Text>

            <Divider my={4} />

            <Heading size="md" color="gray.800">Comments</Heading>
            {post.comments.length > 0 ? (
              <CommentThread comments={post.comments} />
            ) : (
              <Text color="gray.500">No comments yet. Be the first to share your thoughts!</Text>
            )}
          </VStack>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
