import { 
    Container, 
    Heading, 
    Text, 
    VStack, 
    HStack, 
    Box, 
    SimpleGrid, 
    Avatar, 
    Stat, 
    StatLabel, 
    StatNumber,
    Card,
    CardBody,
    Badge,
    Divider,
    Button
  } from "@chakra-ui/react"
  import { FaHeart, FaUsers, FaTrophy, FaLeaf, FaShieldAlt, FaMobile } from "react-icons/fa"
  import { Header } from "@/components/layout/header"
  import { Footer } from "@/components/layout/footer"
  
  export default function AboutPage() {
    const stats = [
      { label: "Success Rate", value: "87%", icon: FaTrophy },
      { label: "Active Users", value: "50K+", icon: FaUsers },
      { label: "Days Smoke-Free", value: "2.1M", icon: FaLeaf },
      { label: "Lives Changed", value: "25K+", icon: FaHeart }
    ]
  
    const features = [
      {
        icon: FaMobile,
        title: "Smart Tracking",
        description: "Monitor your progress with IoT devices and real-time data insights."
      },
      {
        icon: FaUsers,
        title: "Community Support",
        description: "Connect with others on the same journey and share your experiences."
      },
      {
        icon: FaShieldAlt,
        title: "Personalized Plans",
        description: "Get customized quit plans based on your smoking habits and goals."
      },
      {
        icon: FaHeart,
        title: "Health Insights",
        description: "Track your health improvements and celebrate every milestone."
      }
    ]
  
    const team = [
      {
        name: "Dr. Sarah Chen",
        role: "Chief Medical Officer",
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=60",
        bio: "15+ years in addiction medicine and behavioral health."
      },
      {
        name: "Alex Rodriguez",
        role: "Lead Developer",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60",
        bio: "IoT specialist passionate about health technology solutions."
      },
      {
        name: "Maya Patel",
        role: "UX Designer",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&auto=format&fit=crop&q=60",
        bio: "Creating intuitive experiences that motivate positive change."
      }
    ]
  
    return (
      <div className="min-h-screen">
        <Header />
        <main>
          {/* Hero Section */}
          <Box 
            bg="linear-gradient(135deg, #48bb78 0%, #38a169 100%)"
            py={{ base: 16, md: 24 }}
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bg="linear-gradient(45deg, rgba(72, 187, 120, 0.1) 0%, rgba(56, 161, 105, 0.1) 100%)"
            />
            <Container maxW="6xl" position="relative" zIndex={1}>
              <VStack spacing={8} textAlign="center">
                <Badge 
                  bg="white" 
                  color="#7AC555" 
                  px={6} 
                  py={2} 
                  rounded="full"
                  fontSize="sm"
                  fontWeight="bold"
                  shadow="lg"
                >
                  About SmartQuit
                </Badge>
                <Heading 
                  size={{ base: "2xl", md: "3xl" }} 
                  color="white"
                  maxW="5xl"
                  fontWeight="bold"
                  textShadow="0 2px 4px rgba(0,0,0,0.3)"
                >
                  Empowering Your Journey to a 
                  <Text as="span" color="green.200"> Smoke-Free Life</Text>
                </Heading>
                <Text 
                  fontSize={{ base: "xl", md: "2xl" }} 
                  color="whiteAlpha.900" 
                  maxW="4xl"
                  lineHeight="tall"
                  fontWeight="medium"
                >
                  SmartQuit combines cutting-edge IoT technology with proven behavioral science 
                  to help you quit smoking for good. Join thousands who have transformed their lives.
                </Text>
                <Button
                  size="lg"
                  bg="#7AC555"
                  backgroundColor="#7AC555"
                  px={8}
                  py={6}
                  rounded="full"
                  fontWeight="bold"
                  fontSize="lg"
                  shadow="xl"
                  _hover={{ 
                    transform: "translateY(-2px)",
                    shadow: "2xl",
                    bg: "green.50"
                  }}
                  transition="all 0.3s ease"
                >
                  Start Your Journey
                </Button>
              </VStack>
            </Container>
          </Box>
  
          {/* Stats Section */}
          <Box bg="gray.50" py={{ base: 16, md: 20 }}>
            <Container maxW="6xl">
              <VStack spacing={12}>
                <Heading size="xl" color="gray.800" textAlign="center">
                  Our Impact in Numbers
                </Heading>
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8}>
                  {stats.map((stat, index) => (
                    <Card 
                      key={index} 
                      bg="white" 
                      shadow="xl" 
                      rounded="2xl" 
                      border="none"
                      _hover={{ 
                        transform: "translateY(-8px)",
                        shadow: "2xl"
                      }}
                      transition="all 0.3s ease"
                    >
                      <CardBody textAlign="center" py={8}>
                        <VStack spacing={4}>
                          <Box 
                            p={4} 
                            bg={`linear-gradient(135deg, ${
                              index === 0 ? '#FFD700, #FFA500' :
                              index === 1 ? '#00CED1, #20B2AA' :
                              index === 2 ? '#32CD32, #228B22' :
                              '#FF69B4, #FF1493'
                            })`}
                            rounded="full"
                            color="white"
                            shadow="lg"
                          >
                            <stat.icon size={28} />
                          </Box>
                          <Stat textAlign="center">
                            <StatNumber 
                              fontSize="3xl" 
                              fontWeight="bold"
                              bgGradient={`linear(to-r, ${
                                index === 0 ? 'yellow.400, orange.500' :
                                index === 1 ? 'cyan.400, teal.500' :
                                index === 2 ? 'green.400, #7AC555' :
                                'pink.400, pink.600'
                              })`}
                              bgClip="text"
                            >
                              {stat.value}
                            </StatNumber>
                            <StatLabel color="gray.600" fontSize="md" fontWeight="medium">
                              {stat.label}
                            </StatLabel>
                          </Stat>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              </VStack>
            </Container>
          </Box>
  
          <Divider />
  
          {/* Mission Section */}
          <Box bg="linear-gradient(135deg, #48bb78 0%, #38a169 100%)" py={{ base: 16, md: 20 }}>
            <Container maxW="6xl">
              <VStack spacing={10} textAlign="center">
                <Heading size="2xl" color="white" fontWeight="bold">
                  Transforming Lives, One Breath at a Time
                </Heading>
                <Text 
                  fontSize={{ base: "lg", md: "xl" }}
                  color="whiteAlpha.900" 
                  maxW="5xl" 
                  lineHeight="tall"
                  fontWeight="medium"
                >
                  We believe everyone deserves a chance at a healthier life. SmartQuit was born from 
                  the understanding that quitting smoking is one of the most challenging yet rewarding 
                  journeys a person can take. Our mission is to provide the tools, support, and 
                  motivation needed to make this journey successful.
                </Text>
              </VStack>
            </Container>
          </Box>
  
          <Divider />
  
          {/* Features Section */}
          <Box bg="white" py={{ base: 16, md: 20 }}>
            <Container maxW="6xl">
              <VStack spacing={16}>
                <VStack spacing={6} textAlign="center">
                  <Heading size="2xl" color="gray.800" fontWeight="bold">
                    Comprehensive Support System
                  </Heading>
                  <Text fontSize="xl" color="gray.600" maxW="4xl" lineHeight="tall">
                    Our comprehensive approach combines technology, community, and personalized support.
                  </Text>
                </VStack>
                
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                  {features.map((feature, index) => (
                    <Card 
                      key={index} 
                      bg="white"
                      shadow="2xl" 
                      rounded="3xl"
                      border="1px solid"
                      borderColor="gray.100"
                      _hover={{ 
                        transform: "translateY(-10px)",
                        shadow: "3xl",
                        borderColor: "green.200"
                      }}
                      transition="all 0.4s ease"
                      overflow="hidden"
                    >
                      <CardBody p={8}>
                        <VStack spacing={6} align="start">
                          <Box 
                            p={4} 
                            bg="linear-gradient(135deg, #48bb78, #38a169)"
                            rounded="2xl"
                            color="white"
                            shadow="lg"
                            alignSelf="start"
                          >
                            <feature.icon size={32} />
                          </Box>
                          <VStack align="start" spacing={4}>
                            <Heading size="lg" color="gray.800" fontWeight="bold">
                              {feature.title}
                            </Heading>
                            <Text color="gray.600" fontSize="lg" lineHeight="tall">
                              {feature.description}
                            </Text>
                          </VStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              </VStack>
            </Container>
          </Box>
  
          {/* Team Section */}
          <Box bg="gray.50" py={{ base: 16, md: 20 }}>
            <Container maxW="6xl">
              <VStack spacing={16}>
                <VStack spacing={6} textAlign="center">
                  <Heading size="2xl" color="gray.800" fontWeight="bold">
                    Our Team
                  </Heading>
                  <Text fontSize="xl" color="gray.600" maxW="4xl" lineHeight="tall">
                    Our diverse team combines medical expertise, technology innovation, and design excellence.
                  </Text>
                </VStack>
                
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
                  {team.map((member, index) => (
                    <Card 
                      key={index} 
                      bg="white"
                      shadow="2xl" 
                      rounded="3xl"
                      border="none"
                      textAlign="center"
                      _hover={{ 
                        transform: "translateY(-12px)",
                        shadow: "3xl"
                      }}
                      transition="all 0.4s ease"
                      overflow="hidden"
                    >
                      <CardBody p={8}>
                        <VStack spacing={6}>
                          <Avatar 
                            size="2xl" 
                            name={member.name} 
                            src={member.avatar}
                            border="4px solid"
                            borderColor="green.400"
                          />
                          <VStack spacing={3}>
                            <Heading size="lg" color="gray.800" fontWeight="bold">
                              {member.name}
                            </Heading>
                            <Text 
                              color="#7AC555"
                              fontWeight="bold" 
                              fontSize="md"
                            >
                              {member.role}
                            </Text>
                            <Text color="gray.600" fontSize="md" lineHeight="tall">
                              {member.bio}
                            </Text>
                          </VStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              </VStack>
            </Container>
          </Box>
  
          {/* CTA Section */}
          <Box 
            bg="linear-gradient(135deg, #48bb78 0%, #38a169 100%)" 
            py={{ base: 20, md: 24 }}
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bg="radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)"
            />
            <Container maxW="5xl" position="relative" zIndex={1}>
              <VStack spacing={10} textAlign="center" color="white">
                <Heading size="3xl" fontWeight="bold" textShadow="0 2px 4px rgba(0,0,0,0.3)">
                  Ready to Start Your Journey?
                </Heading>
                <Text fontSize="2xl" opacity={0.95} maxW="4xl" lineHeight="tall" fontWeight="medium">
                  Join thousands of people who have successfully quit smoking with SmartQuit.
                </Text>
                <HStack spacing={6} pt={6} flexWrap="wrap" justify="center">
                  <Button
                    size="xl"
                    bg="white"
                    color="#7AC555"
                    px={12}
                    py={8}
                    rounded="full"
                    fontWeight="bold"
                    fontSize="xl"
                    shadow="2xl"
                    _hover={{ 
                      transform: "translateY(-4px)",
                      shadow: "3xl",
                      bg: "green.50"
                    }}
                    transition="all 0.4s ease"
                  >
                    Get Started Today
                  </Button>
                  <Button
                    size="xl"
                    variant="outline"
                    borderColor="white"
                    borderWidth="3px"
                    color="white"
                    px={12}
                    py={8}
                    rounded="full"
                    fontWeight="bold"
                    fontSize="xl"
                    _hover={{ 
                      bg: "whiteAlpha.200",
                      transform: "translateY(-4px)",
                      borderColor: "green.200"
                    }}
                    transition="all 0.4s ease"
                  >
                    Learn More
                  </Button>
                </HStack>
              </VStack>
            </Container>
          </Box>
        </main>
        <Footer />
      </div>
    )
  }
  