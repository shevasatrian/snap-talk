import { Flex, Stack, Heading, FormControl, Input, Button, useToast } from "@chakra-ui/react"
import { useState } from "react"
import { useMutation } from "@/hooks/useMutation"
import Cookies from "js-cookie"
import { useRouter } from "next/router"
import Link from "next/link"

export default function Register() {
  const router = useRouter()
  const toast = useToast()
  const { mutate } = useMutation()
  const [payload, setPayload] = useState({
    name: "",
    email: "",
    password: "",
  })

  const HandleSubmit = async () => {
    const response = await mutate({ 
      url: 'https://paace-f178cafcae7b.nevacloud.io/api/register',
      payload,
    })
    console.log('response => ', response)
  }

  // const HandleSubmit = async () => {
  //   const response = await mutate({ url: "https://paace-f178cafcae7b.nevacloud.io/api/login", payload})
  //   if (!response?.success) {
  //     toast({
  //       title: 'Login Gagal',
  //       description: "email dan password tidak sesuai",
  //       status: 'error',
  //       duration: 2000,
  //       isClosable: true,
  //       position: "top",
  //     })
  //   } else {
  //     Cookies.set('user_token', response?.data?.token, { expires: new Date(response?.data?.expires_at ), path: "/"})
  //     router.push('/')
  //   }
  // }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h4 className="text-2xl font-bold mb-4">Register SnapTalk</h4>
        <div className="mb-4">
          <label for="email">Name</label>
          <input
            className="border w-full p-2 rounded-2xl focus:outline-none focus:border-blue-500"
            value={payload?.name}
            onChange={(event) => setPayload({ ...payload, name: event.target.value })}
            placeholder="Email"
          />
        </div>
        <div className="mb-4">
          <label for="email">Email</label>
          <input
            className="border w-full p-2 rounded-2xl focus:outline-none focus:border-blue-500"
            value={payload?.email}
            onChange={(event) => setPayload({ ...payload, email: event.target.value })}
            placeholder="Email"
          />
        </div>
        <div className="mb-4">
          <label for="password">Password</label>
          <input
            className="border w-full p-2 rounded-2xl focus:outline-none focus:border-blue-500"
            value={payload?.password}
            onChange={(event) => setPayload({ ...payload, password: event.target.value })}
            placeholder="Password"
            type="password"
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
  )
  
}