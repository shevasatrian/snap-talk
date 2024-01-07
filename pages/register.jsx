import {
  Flex, Stack, Heading, FormControl, Input, Button, useToast
} from "@chakra-ui/react";
import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { useMutation } from "@/hooks/useMutation";

export default function Register() {
  const router = useRouter();
  const toast = useToast();
  const { mutate } = useMutation();
  const [payload, setPayload] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    hobby: "",
    dob: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const HandleSubmit = async () => {
    const response = await mutate({
      url: "https://paace-f178cafcae7b.nevacloud.io/api/register",
      payload,
    });
    // console.log('response => ', response)
    if (!response?.success) {
      toast({
        title: "Register Failed",
        description: "Please repeat the registration",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } else {
      toast({
        title: "Register Success",
        description: "Please Login",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      router.push("/login");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h4 className="text-2xl font-bold mb-4">Register SnapTalk</h4>
        <div className="mb-4">
          <label htmlFor="email">Name</label>
          <input
            className="border w-full p-2 rounded-2xl focus:outline-none focus:border-blue-500"
            value={payload?.name}
            onChange={(event) => setPayload({ ...payload, name: event.target.value })}
            placeholder="Name"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            className="border w-full p-2 rounded-2xl focus:outline-none focus:border-blue-500"
            value={payload?.email}
            onChange={(event) => setPayload({ ...payload, email: event.target.value })}
            placeholder="Email"
            required
          />
        </div>
        <div className="mb-4 relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            className="border w-full p-2 rounded-2xl focus:outline-none focus:border-blue-500"
            value={payload?.password}
            onChange={(event) => setPayload({ ...payload, password: event.target.value })}
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            required
          />
          <button
            className="absolute top-1/2 right-2 transform -translate-y-1/4 px-2 py-3 text-sm text-gray-500 focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <div className="mb-4">
          <label htmlFor="dob">Date of Birthday</label>
          <input
            className="border w-full p-2 rounded-2xl focus:outline-none focus:border-blue-500"
            value={payload?.dob}
            onChange={(event) => setPayload({ ...payload, dob: event.target.value })}
            id="dob"
            type="date"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone">Phone</label>
          <input
            className="border w-full p-2 rounded-2xl focus:outline-none focus:border-blue-500"
            value={payload?.phone}
            onChange={(event) => {
              const numericValue = event.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
              setPayload({ ...payload, phone: numericValue });
            }}
            type="tel"
            id="phone"
            pattern="[0-9]*"
            placeholder="Enter numeric phone"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="hobby">Hobby</label>
          <input
            className="border w-full p-2 rounded-2xl focus:outline-none focus:border-blue-500"
            value={payload?.hobby}
            onChange={(event) => setPayload({ ...payload, hobby: event.target.value })}
            placeholder="Hobby"
          />
        </div>
        <div>
          <button
            onClick={() => HandleSubmit()}
            className="bg-blue-500 text-white w-full px-6 py-2 rounded-2xl hover:bg-blue-700 focus:outline-none"
          >
            Register
          </button>
          <div className="mt-1 pl-1 text-sm">
            <p className="text-gray-600">already have an account? <Link className="text-blue-600 hover:text-gray-800" href="/login">Login</Link> </p>
          </div>
        </div>
      </div>
    </div>
  );
}
