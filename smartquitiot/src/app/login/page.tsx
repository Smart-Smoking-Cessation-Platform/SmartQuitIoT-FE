"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import {
  Box,
  Container,
  Flex,
  Text,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Divider,
  useToast,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Checkbox,
  VStack,
  HStack,
  Icon
} from "@chakra-ui/react"
import { FiEye, FiEyeOff, FiMail, FiArrowLeft } from "react-icons/fi"
import { FaGoogle, FaFacebook } from "react-icons/fa"
import NextLink from "next/link"
import logoImg from "@/assets/logo/logo.png"

type AuthMode = 'login' | 'register' | 'forgot'

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    rememberMe: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const toast = useToast()
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    const p = params.get('mode') as AuthMode | null
    if (p === 'register' || p === 'login' || p === 'forgot') {
      setMode(p)
    }
  }, [params])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (mode !== 'forgot') {
      if (!formData.password) {
        newErrors.password = 'Password is required'
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters'
      }
    }

    if (mode === 'register') {
      if (!formData.firstName) newErrors.firstName = 'First name is required'
      if (!formData.lastName) newErrors.lastName = 'Last name is required'
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      if (mode === 'login') {
        // Demo: admin/coach redirect (normalize input)
        const emailNorm = formData.email.trim().toLowerCase()
        const passNorm = formData.password.trim()
        const isAdmin = emailNorm === 'admin@gmail.com' && passNorm === 'Password123@'
        const isCoach = emailNorm === 'coach@gmail.com' && passNorm === 'Password123@'
        toast({
          title: isAdmin ? 'Welcome, Admin!' : isCoach ? 'Welcome, Coach!' : 'Welcome back!',
          description: isAdmin ? 'Redirecting to admin dashboard.' : isCoach ? 'Redirecting to coach dashboard.' : 'You have successfully logged in.',
          status: 'success',
          duration: 1500,
          isClosable: true,
        })
        router.push(isAdmin ? '/admin' : isCoach ? '/coach' : '/')
        return
      }

      if (mode === 'forgot') {
        toast({
          title: 'OTP sent',
          description: 'We sent a 6-digit code to your email for verification.',
          status: 'success',
          duration: 2500,
          isClosable: true,
        })
        router.push(`/otp?email=${encodeURIComponent(formData.email)}`)
        return
      }

      // register
      toast({
        title: 'Account created!',
        description: 'Please check your email to verify your account.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    }, 300)
  }

  const renderForm = () => {
    switch (mode) {
      case 'login':
        return (
          <VStack spacing={4} w="full">
            <FormControl isInvalid={!!errors.email}>
              <FormLabel color="gray.700">Email Address</FormLabel>
              <InputGroup>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  bg="gray.50"
                  borderColor="green.200"
                  _focus={{ borderColor: "green.400", boxShadow: "0 0 0 1px var(--chakra-colors-green-400)" }}
                />
                <InputRightElement>
                  <Icon as={FiMail} color="gray.400" />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password}>
              <FormLabel color="gray.700">Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  bg="gray.50"
                  borderColor="green.200"
                  _focus={{ borderColor: "green.400", boxShadow: "0 0 0 1px var(--chakra-colors-green-400)" }}
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    icon={showPassword ? <FiEyeOff /> : <FiEye />}
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>

            <HStack justify="space-between" w="full">
              <Checkbox
                isChecked={formData.rememberMe}
                onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                colorScheme="green"
              >
                <Text fontSize="sm" color="gray.600" marginTop={4}>Remember this device</Text>
              </Checkbox>
              <Button
                variant="link"
                size="sm"
                color="#7AC555"
                onClick={() => setMode('forgot')}
              >
                Forgot password?
              </Button>
            </HStack>
          </VStack>
        )

      case 'register':
        return (
          <VStack spacing={4} w="full">
            <HStack spacing={4} w="full">
              <FormControl isInvalid={!!errors.firstName}>
                <FormLabel color="gray.700">First Name</FormLabel>
                <Input
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  bg="gray.50"
                  borderColor="green.200"
                  _focus={{ borderColor: "green.400", boxShadow: "0 0 0 1px var(--chakra-colors-green-400)" }}
                />
                <FormErrorMessage>{errors.firstName}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.lastName}>
                <FormLabel color="gray.700">Last Name</FormLabel>
                <Input
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  bg="gray.50"
                  borderColor="green.200"
                  _focus={{ borderColor: "green.400", boxShadow: "0 0 0 1px var(--chakra-colors-green-400)" }}
                />
                <FormErrorMessage>{errors.lastName}</FormErrorMessage>
              </FormControl>
            </HStack>

            <FormControl isInvalid={!!errors.email}>
              <FormLabel color="gray.700">Email Address</FormLabel>
              <InputGroup>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  bg="gray.50"
                  borderColor="green.200"
                  _focus={{ borderColor: "green.400", boxShadow: "0 0 0 1px var(--chakra-colors-green-400)" }}
                />
                <InputRightElement>
                  <Icon as={FiMail} color="gray.400" />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password}>
              <FormLabel color="gray.700">Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  bg="gray.50"
                  borderColor="green.200"
                  _focus={{ borderColor: "green.400", boxShadow: "0 0 0 1px var(--chakra-colors-green-400)" }}
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    icon={showPassword ? <FiEyeOff /> : <FiEye />}
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.confirmPassword}>
              <FormLabel color="gray.700">Confirm Password</FormLabel>
              <InputGroup>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  bg="gray.50"
                  borderColor="green.200"
                  _focus={{ borderColor: "green.400", boxShadow: "0 0 0 1px var(--chakra-colors-green-400)" }}
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    icon={showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
            </FormControl>
          </VStack>
        )

      case 'forgot':
        return (
          <VStack spacing={4} w="full">
            <Text color="gray.600" textAlign="center" mb={2}>
              Enter your email address and we will send you a link to reset your password.
            </Text>
            <FormControl isInvalid={!!errors.email}>
              <FormLabel color="gray.700">Email Address</FormLabel>
              <InputGroup>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  bg="gray.50"
                  borderColor="green.200"
                  _focus={{ borderColor: "green.400", boxShadow: "0 0 0 1px var(--chakra-colors-green-400)" }}
                />
                <InputRightElement>
                  <Icon as={FiMail} color="gray.400" />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>
          </VStack>
        )
      default:
        return null
    }
  }

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Welcome Back'
      case 'register': return 'Start Your Journey'
      case 'forgot': return 'Reset Password'
    }
  }

  const getSubtitle = () => {
    switch (mode) {
      case 'login': return 'Sign in to continue your smoke-free journey'
      case 'register': return 'Join thousands who have successfully quit smoking'
      case 'forgot': return 'We\'ll send a 6-digit code to your email to verify'
    }
  }

  const getButtonText = () => {
    switch (mode) {
      case 'login': return 'Sign In'
      case 'register': return 'Create Account'
      case 'forgot': return 'Send OTP'
    }
  }

  return (
    <Box minH="100vh" bg="green.50">
      <Container maxW="7xl" px={6} py={8}>
        <NextLink href="/">
          <Button leftIcon={<FiArrowLeft />} variant="ghost" color="#7AC555" mb={8}>
            Back to Home
          </Button>
        </NextLink>
        
        <Flex direction={{ base: "column", lg: "row" }} gap={12} align="center" minH="80vh">
          {/* Left Side - Branding */}
          <Box flex={1} textAlign={{ base: "center", lg: "left" }}>
            <HStack spacing={3} justify={{ base: "center", lg: "flex-start" }} mb={6}>
              <Box w={24} h={24} position="relative">
                <Image src={logoImg} alt="SmartQuit logo" fill style={{ objectFit: "contain" }} />
              </Box>
              <Text fontSize="3xl" fontWeight="bold" color="#7AC555">SmartQuit</Text>
            </HStack>
            <Text fontSize="xl" color="gray.600" mb={8} maxW="md">
              Take control of your health and join millions who have successfully quit smoking with our proven methods and supportive community.
            </Text>
            <Box display={{ base: "none", lg: "block" }}>
              <Text fontSize="lg" fontWeight="semibold" color="#7AC555" mb={4}>
                Why Choose SmartQuit?
              </Text>
              <VStack align="flex-start" spacing={3} color="gray.600">
                <Text>✓ Personalized quit plans tailored to your habits</Text>
                <Text>✓ 24/7 community support from fellow quitters</Text>
                <Text>✓ Track your progress and celebrate milestones</Text>
                <Text>✓ Evidence-based techniques that actually work</Text>
              </VStack>
            </Box>
          </Box>

          {/* Right Side - Auth Form */}
          <Box flex={1} w="full" maxW="md" mx="auto">
            <Box
              bg="white"
              rounded="2xl"
              shadow="xl"
              p={8}
              borderWidth="1px"
              borderColor="green.100"
            >
              <VStack gap={6} w="full">
                <VStack spacing={2} textAlign="center">
                  <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                    {getTitle()}
                  </Text>
                  <Text color="gray.600">
                    {getSubtitle()}
                  </Text>
                </VStack>

                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                  <VStack spacing={6} w="full">
                    {renderForm()}

                    <Button
                      type="submit"
                      size="lg"
                      w="full"
                      bg="#7AC555"
                      backgroundColor="#7AC555"
                      color="white"
                      _hover={{ bg: '#6BB04B' }}
                      isLoading={isLoading}
                      loadingText={mode === 'login' ? 'Signing in...' : mode === 'register' ? 'Creating account...' : 'Sending...'}
                    >
                      {getButtonText()}
                    </Button>
                  </VStack>
                </form>

                {mode !== 'forgot' && (
                  <>
                    <Divider />
                    
                    <VStack spacing={3} w="full">
                      <Text fontSize="sm" color="gray.500">Or continue with</Text>
                      <HStack spacing={4} w="full">
                        <Button
                          leftIcon={<FaGoogle />}
                          variant="outline"
                          flex={1}
                          borderColor="gray.300"
                          _hover={{ borderColor: "green.300", bg: "green.50" }}
                        >
                          Google
                        </Button>
                        <Button
                          leftIcon={<FaFacebook />}
                          variant="outline"
                          flex={1}
                          borderColor="gray.300"
                          _hover={{ borderColor: "green.300", bg: "green.50" }}
                        >
                          Facebook
                        </Button>
                      </HStack>
                    </VStack>
                  </>
                )}

                <Divider />

                {/* Mode Switching */}
                <VStack spacing={2}>
                  {mode === 'login' && (
                    <HStack gap={1} fontSize="sm">
                      <Text color="gray.600">Don&apos;t have an account?</Text>
                      <Button
                        variant="link"
                        color="#7AC555"
                        size="sm"
                        onClick={() => setMode('register')}
                        marginBottom={3}
                      >
                        Sign up
                      </Button>
                    </HStack>
                  )}
                  
                  {mode === 'register' && (
                    <HStack gap={1} fontSize="sm">
                      <Text color="gray.600">Already have an account?</Text>
                      <Button
                        variant="link"
                        color="#7AC555"
                        size="sm"
                        onClick={() => setMode('login')}
                        >
                        Sign in
                      </Button>
                    </HStack>
                  )}
                  
                  {mode === 'forgot' && (
                    <HStack gap={1} fontSize="sm">
                      <Text color="gray.600">Remember your password?</Text>
                      <Button
                        variant="link"
                        color="#7AC555"
                        size="sm"
                        onClick={() => setMode('login')}
                      >
                        Sign in
                      </Button>
                    </HStack>
                  )}
                </VStack>
              </VStack>
            </Box>
          </Box>
        </Flex>
      </Container>
    </Box>
  )
}
