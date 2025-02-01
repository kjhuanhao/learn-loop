import { getUnClassifiedFolderIdAction } from "@/actions/question"
import { useSettingsStore } from "@/stores/settingsSlice"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"

/**
 * 初始化应用，获取一些基础的设置
 * @returns
 */
export const useInitApplication = () => {
  const { setUnClassifiedFolderId } = useSettingsStore()
  const { data } = useQuery({
    queryKey: ["unClassifiedFolderId"],
    queryFn: getUnClassifiedFolderIdAction,
  })

  useEffect(() => {
    if (data?.success && data.data) {
      setUnClassifiedFolderId(data.data)
    }
  }, [data, setUnClassifiedFolderId])

  return {
    unClassifiedFolderId: data?.data,
  }
}
