import { useToast } from "@chakra-ui/react"
import { useState } from "react"
import { useMutation } from "@/hooks/useMutation"
import Cookies from "js-cookie"
import { useRouter } from "next/router"
import Link from "next/link"

export default function Login() {
  const router = useRouter()
  const toast = useToast()
  const { mutate } = useMutation()
  const [payload, setPayload] = useState({
    email: "",
    password: "",
  })

  const HandleSubmit = async () => {
    const response = await mutate({ url: "https://paace-f178cafcae7b.nevacloud.io/api/login", payload})
    if (!response?.success) {
      toast({
        title: 'Login Gagal',
        description: "email dan password tidak sesuai",
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: "top",
      })
    } else {
      Cookies.set('user_token', response?.data?.token, { expires: new Date(response?.data?.expires_at ), path: "/"})
      router.push('/')
    }
  }

  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h4 className="text-2xl font-bold mb-4">Login SnapTalk</h4>
        <div className="mb-4">
          <label for="email">Email</label>
          <input
            className="border w-full p-2 rounded-2xl focus:outline-none focus:border-blue-500"
            value={payload?.email}
            onChange={(event) => setPayload({ ...payload, email: event.target.value })}
            placeholder="Email"
          />
        </div>
        <div className="mb-4 relative">
          <label for="password">Password</label>
          <input
            className="border w-full p-2 rounded-2xl focus:outline-none focus:border-blue-500"
            value={payload?.password}
            onChange={(event) => setPayload({ ...payload, password: event.target.value })}
            placeholder="Password"
            type={showPassword ? "text" : "password"}
          />
          <button
            className="absolute top-1/2 right-2 transform -translate-y-1/4 px-2 py-3 text-sm text-gray-500 focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <div>
          <button
            onClick={() => HandleSubmit()}
            className="bg-blue-500 text-white w-full px-6 py-2 rounded-2xl hover:bg-blue-700 focus:outline-none"
          >
            Login
          </button>
        <div className="mt-1 pl-1 text-sm">
          <p className="text-gray-600">don't have an account? <Link className="text-blue-600 hover:text-gray-800" href="/register">Register</Link> </p>
        </div>
        </div>
      </div>
    </div>
  )
  
}