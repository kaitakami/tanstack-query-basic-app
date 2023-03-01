import { useQuery, useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { queryClient } from "./main"

const POSTS = [
  { id: "1", title: 'Post 1' },
  { id: "2", title: 'Post 2' },
]

function wait(duration: number) {
  return new Promise(resolve => setTimeout(resolve, duration))
}

function App() {
  const [inputState, setInputState] = useState('')

  const postsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: () => wait(1000).then(() => POSTS),
  })

  const newPostMutation = useMutation({
    mutationFn: (title: string) => wait(1000).then(() => POSTS.push({ id: crypto.randomUUID(), title })),
    onSuccess: () => queryClient.invalidateQueries(["posts"])
  })

  if (postsQuery.isLoading) return <h1>Loading...</h1>
  if (postsQuery.isError) return (<>
    <h1>Error</h1>
    <pre>{JSON.stringify(postsQuery.error)}</pre>
  </>)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputState(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    newPostMutation.mutate(inputState)
    setInputState('')
  }

  return (
    <div>
      <h1>Posts</h1>
      <hr />
      <form onSubmit={handleSubmit}>
        <h3>Create new post</h3>
        <input type="text" placeholder="title" value={inputState} onChange={handleChange} required />
        <button disabled={newPostMutation.isLoading} >Submit</button>
      </form>
      <hr />
      {postsQuery.data.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
        </div>
      ))}
    </div>
  )
}

export default App
