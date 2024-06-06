import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@renderer/components/ui/alert-dialog"
import { apiClient, apiFetch } from "@renderer/lib/api-fetch"
import { Queries } from "@renderer/queries"
import { useMutation } from "@tanstack/react-query"

export function CategoryRemoveDialog({
  feedIdList,
  onSuccess,
  category,
  view,
}: {
  feedIdList: string[]
  onSuccess?: () => void
  category: string
  view?: number
}) {
  const renameMutation = useMutation({
    mutationFn: async () =>

      apiClient.categories.$delete({
        json: {
          feedIdList,
          deleteSubscriptions: false,
        },
      }),
    onSuccess: () => {
      Queries.subscription.byView(view).invalidate()

      onSuccess?.()
    },
  })

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Remove category
          {" "}
          <span className="font-bold">{category}</span>
          ?
        </AlertDialogTitle>
        <AlertDialogDescription>
          This operation will delete your category, but the feeds it contains
          will be retained and grouped by website.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={() => renameMutation.mutate()}>
          Continue
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
