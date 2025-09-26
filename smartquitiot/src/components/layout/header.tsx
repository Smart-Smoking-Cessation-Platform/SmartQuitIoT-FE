"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Box,
  Container,
  Grid,
  HStack,
  IconButton,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { FiMenu, FiBell } from "react-icons/fi";
import logoImg from "@/assets/logo/logo.png";

export function Header() {
  const [isLoggedIn] = useState(false);
  const bg = "whiteAlpha.800";

  const menuLinks = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Resources", href: "/resources" },
    { name: "Community", href: "/community" },
    { name: "About", href: "/about" },
  ];

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={50}
      bg={bg}
      backdropFilter="saturate(180%) blur(6px)"
      borderTopWidth="3px"
      borderTopColor="gray.400"
    >
      <Container maxW="6xl" px={4}>
        <Grid templateColumns={{ base: "auto 1fr auto", md: "auto 1fr auto" }} alignItems="center" h={20} w="full" columnGap={4}>
          {/* Brand: Logo + Text */}
          <Link href="/">
            <Box w={20} h={20} position="relative">
              <Image
                src={logoImg}
                alt="SmartQuit logo"
                fill
                style={{ objectFit: "contain" }}
              />
            </Box>
          </Link>

          {/* Centered Desktop Nav */}
          <HStack as="nav" spacing={8} justifySelf="center" display={{ base: "none", md: "flex" }} position="relative" top="2px">
            {menuLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  color="gray.700"
                  _hover={{ color: "#7AC555" }}
                >
                  {link.name}
                </Text>
              </Link>
            ))}
          </HStack>

          {/* Right Actions */}
          {isLoggedIn ? (
            <HStack spacing={4} justifySelf="end" display={{ base: "none", md: "flex" }}>
              <IconButton aria-label="Notifications" variant="ghost">
                <FiBell />
              </IconButton>
              <Box w={8} h={8} rounded="full" bg="green.200" />
            </HStack>
          ) : (
            <HStack spacing={3} justifySelf="end" display={{ base: "none", md: "flex" }}>
              <Link href="/login">
                <Button variant="ghost" size="sm" fontWeight="medium" color="gray.700">
                  Login
                </Button>
              </Link>
              <Link href="/login?mode=register">
                <Button
                  size="sm"
                  bg="#7AC555"
                  color="white"
                  _hover={{ bg: "#27632A" }}
                >
                  Get Started
                </Button>
              </Link>
            </HStack>
          )}

          {/* Mobile Menu Button (Right) */}
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Menu"
              display={{ base: "inline-flex", md: "none" }}
              variant="ghost"
              justifySelf="end"
            >
              <FiMenu />
            </MenuButton>
            <MenuList>
              {menuLinks.map((link) => (
                <MenuItem key={link.name} as={Link} href={link.href}>
                  {link.name}
                </MenuItem>
              ))}
              {!isLoggedIn && (
                <>
                  <MenuItem as={Link} href="/login">
                    Login
                  </MenuItem>
                  <MenuItem as={Link} href="/login?mode=register">
                    Get Started
                  </MenuItem>
                </>
              )}
            </MenuList>
          </Menu>
        </Grid>
      </Container>
      {/* Bottom bar removed as requested */}
    </Box>
  );
}
