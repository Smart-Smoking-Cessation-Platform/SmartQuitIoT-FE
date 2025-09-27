"use client";

import {
  Box,
  Container,
  SimpleGrid,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Button,
} from "@chakra-ui/react";
import {
  FaTrophy,
  FaBookOpen,
  FaUsers,
  FaHeart,
  FaDollarSign,
  FaRobot,
  FaChartBar,
  FaBell,
} from "react-icons/fa";

const features = [
  {
    icon: FaTrophy,
    title: "Achievement Tracking",
    description:
      "Earn badges and track your progress with our comprehensive achievement system.",
  },
  {
    icon: FaBookOpen,
    title: "Smoking Diary",
    description:
      "Log your daily progress, track cravings, and monitor health improvements.",
  },
  {
    icon: FaUsers,
    title: "Community Support",
    description:
      "Connect with others on the same journey and share success stories.",
  },
  {
    icon: FaHeart,
    title: "Health Monitoring",
    description:
      "Track your health improvements and see the benefits of quitting.",
  },
  {
    icon: FaDollarSign,
    title: "Financial Tracking",
    description: "See how much money you’re saving by quitting smoking.",
  },
  {
    icon: FaRobot,
    title: "AI Chatbot",
    description: "Get personalized advice and support from our AI assistant.",
  },
  {
    icon: FaChartBar,
    title: "Progress Analytics",
    description: "Visualize your journey with detailed charts and tracking.",
  },
  {
    icon: FaBell,
    title: "Smart Notifications",
    description: "Receive motivational reminders and celebrate milestones.",
  },
];

export function FeaturesSection() {
  const cardBg = "white"; // thêm cardBg để tránh undefined

  return (
    <Box as="section" py={{ base: 12, md: 20 }} bg="white">
      <Container maxW="7xl" px={6}>
        <VStack gap={4} textAlign="center" mb={12}>
          <Heading as="h2" size="xl" color="#7AC555">
            Everything You Need to Succeed
          </Heading>
          <Text color="gray.600" maxW="3xl">
            SmartQuit provides comprehensive tools to support your quit journey.
            From tracking progress to community support, we’ve got you covered.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={8}>
          {features.map((f) => (
            <VStack
              key={f.title}
              gap={4}
              bg={cardBg}
              rounded="xl"
              p={8}
              shadow="lg"
            >
              <HStack
                w={20}
                h={20}
                bg="white"
                rounded="full"
                alignItems="center"
                justifyContent="center"
                shadow="md"
              >
                <Icon as={f.icon} color="#7AC555" boxSize={8} fontWeight="bold" />
              </HStack>
              <VStack>
                <Heading as="h4" size="md" color="#7AC555">
                  {f.title}
                </Heading>
                {/* Nếu muốn giá trị lớn hơn, có thể thêm giá trị numeric hoặc bỏ đi */}
              </VStack>
              <Text
                color="gray.600"
                fontSize="sm"
                noOfLines={3}
                textAlign="center"
              >
                {f.description}
              </Text>
            </VStack>
          ))}
        </SimpleGrid>

        <VStack gap={6} mt={16}>
          <Heading as="h3" size="lg" color="#7AC555">
            Ready to Start Your Journey?
          </Heading>
          <HStack>
            <Button
              onClick={() => (window.location.href = "/register")}
              bg="#7AC555"
              color="white"
              _hover={{ bg: "#6BB04B" }}
            >
              Get Started Now →
            </Button>
            <Button
              onClick={() => (window.location.href = "/features")}
              variant="outline"
              borderColor="#7AC555"
              color="#7AC555"
              _hover={{ bg: "#E8F7EC" }}
            >
              Learn More →
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
}
