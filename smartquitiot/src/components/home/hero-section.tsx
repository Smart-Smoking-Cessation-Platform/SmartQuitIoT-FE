"use client"

import Link from "next/link"
import Image from "next/image"
import { Box, Container, SimpleGrid, Heading, Text, Button, HStack, VStack } from "@chakra-ui/react"
import doctorImg from "@/assets/doctor.png"

export function HeroSection() {
  const statBg = "white"
  return (
    <Box as="section" py={{ base: 12, md: 20 }} bg="green.50">
      <Container maxW="7xl" px={6}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={12} alignItems="center">
          <VStack align="start" gap={6}>
            <Text textTransform="uppercase" letterSpacing="widest" color="#7AC555" fontWeight="semibold">Begin today</Text>
            <Heading as="h1" size="2xl" lineHeight="short" color="#7AC555">
              Your Journey to a <Text as="span">Smoke‑Free Life</Text>
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Join thousands who have successfully quit with SmartQuit. Get personalized support, track progress, and achieve your smoke‑free goals.
            </Text>
            <HStack gap={4} flexWrap="wrap">
              <Link href="/login?mode=register"><Button size="lg" bg="#7AC555" backgroundColor="#7AC555" color="white" _hover={{ bg: "#6BB04B" }}>Start Your Journey</Button></Link>
              <Link href="/how-it-works"><Button variant="ghost" size="lg">How It Works</Button></Link>
            </HStack>
            <SimpleGrid columns={{ base: 2, sm: 4 }} gap={6} pt={4} w="full">
              <VStack bg={statBg} rounded="lg" p={4} shadow="md" gap={1}>
                <Text fontSize="sm" color="gray.600">Active Users</Text>
                <Text fontSize="2xl" fontWeight="bold" color="#7AC555">25k+</Text>
              </VStack>
              <VStack bg={statBg} rounded="lg" p={4} shadow="md" gap={1}>
                <Text fontSize="sm" color="gray.600">Success Rate</Text>
                <Text fontSize="2xl" fontWeight="bold" color="#7AC555">78%</Text>
              </VStack>
              <VStack bg={statBg} rounded="lg" p={4} shadow="md" gap={1}>
                <Text fontSize="sm" color="gray.600">Days Average</Text>
                <Text fontSize="2xl" fontWeight="bold" color="#7AC555">45</Text>
              </VStack>
              <VStack bg={statBg} rounded="lg" p={4} shadow="md" gap={1}>
                <Text fontSize="sm" color="gray.600">Money Saved</Text>
                <Text fontSize="2xl" fontWeight="bold" color="#7AC555">$500</Text>
              </VStack>
            </SimpleGrid>
          </VStack>
          <Box position="relative">
            <Image src={doctorImg} alt="SmartQuit Doctor" priority style={{ width: "100%", height: "auto" }} />
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  )
}
