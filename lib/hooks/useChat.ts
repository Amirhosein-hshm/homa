import { SubmitHandler, useForm } from "react-hook-form";

type Chat = {
  message: string
}

export default function useChat() {
  const { control, handleSubmit } = useForm<Chat>();
  const onSubmit: SubmitHandler<Chat> = (data) => {
    console.log(data)
  }


  return { control, handleSubmit, onSubmit }
}


