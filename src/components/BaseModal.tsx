import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Flex,
  Button,
} from "@chakra-ui/react";
import { fonts } from "../config/designSystem";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  height?: string;
  primaryButtonText?: string;
  onPrimaryButtonClick?: () => void;
  isPrimaryButtonDisabled?: boolean;
  secondaryButtonText?: string;
  onSecondaryButtonClick?: () => void;
}

export default function BaseModal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  height = "500px",
  primaryButtonText,
  onPrimaryButtonClick,
  isPrimaryButtonDisabled = false,
  secondaryButtonText = "Cancel",
  onSecondaryButtonClick,
}: BaseModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      motionPreset="none"
      blockScrollOnMount={false}
    >
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(10px)"
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
      />
      <ModalContent
        position="fixed"
        top="50vh"
        left="50vw"
        transform="translate(-50%, -50%)"
        bg="white"
        borderRadius="lg"
        boxShadow="xl"
        maxW="600px"
        w="90%"
        h="700px"
        display="grid"
        gridTemplateRows="auto 1fr auto"
        fontFamily={fonts.body.primary}
        zIndex={1400}
        p={0}
      >
        <Flex
          borderBottomWidth="1px"
          pb={4}
          px={6}
          pt={4}
          justify="space-between"
          align="center"
        >
          <ModalHeader
            fontSize="md"
            fontFamily={fonts.body.primary}
            p={0}
            m={0}
          >
            {title}
          </ModalHeader>
          <ModalCloseButton position="static" />
        </Flex>
        <ModalBody
          py={6}
          px={6}
          display="grid"
          gridTemplateRows="1fr"
          gap={4}
          overflow="auto"
        >
          {children}
        </ModalBody>
        {(primaryButtonText || secondaryButtonText) && (
          <Flex borderTopWidth="1px" py={4} px={6} justify="flex-end" gap={3}>
            {secondaryButtonText && (
              <Button
                variant="ghost"
                onClick={onSecondaryButtonClick || onClose}
                size="md"
                fontFamily={fonts.body.primary}
                _hover={{ bg: "gray.100" }}
              >
                {secondaryButtonText}
              </Button>
            )}
            {primaryButtonText && (
              <Button
                colorScheme="blue"
                onClick={onPrimaryButtonClick}
                isDisabled={isPrimaryButtonDisabled}
                size="md"
                fontFamily={fonts.body.primary}
                _hover={{ bg: "blue.600" }}
              >
                {primaryButtonText}
              </Button>
            )}
          </Flex>
        )}
      </ModalContent>
    </Modal>
  );
}
