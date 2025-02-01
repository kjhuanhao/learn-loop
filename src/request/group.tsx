import { useQuery } from "@tanstack/react-query"

const createNewGroupFetch = async () => {
  return {}
}

export const useGroupQuery = () => {
  const query = useQuery({
    queryKey: ["group"],
    queryFn: createNewGroupFetch,
  })

  return query
}
