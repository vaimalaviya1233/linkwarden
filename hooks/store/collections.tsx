import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CollectionIncludingMembersAndLinkCount } from "@/types/global";
import { useTranslation } from "next-i18next";
import toast from "react-hot-toast";

const useCollections = () => {
  return useQuery({
    queryKey: ["collections"],
    queryFn: async (): Promise<{
      response: CollectionIncludingMembersAndLinkCount[];
    }> => {
      const response = await fetch("/api/v1/collections");
      const data = await response.json();
      return data;
    },
  });
};

const useCreateCollection = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const load = toast.loading(t("creating"));

      const response = await fetch("/api/v1/collections", {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      toast.dismiss(load);

      return response.json();
    },
    onSuccess: (data) => {
      toast.success(t("created"));
      return queryClient.setQueryData(["collections"], (oldData: any) => {
        return {
          response: [...oldData.response, data.response],
        };
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

const useUpdateCollection = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const load = toast.loading(t("updating_collection"));

      const response = await fetch(`/api/v1/collections/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      toast.dismiss(load);

      return response.json();
    },
    onSuccess: (data) => {
      {
        toast.success(t("updated"));
        return queryClient.setQueryData(["collections"], (oldData: any) => {
          return {
            response: oldData.response.map((collection: any) =>
              collection.id === data.response.id ? data.response : collection
            ),
          };
        });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

const useDeleteCollection = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const load = toast.loading(t("deleting_collection"));

      const response = await fetch(`/api/v1/collections/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.dismiss(load);

      return response.json();
    },
    onSuccess: (data) => {
      toast.success(t("deleted"));
      return queryClient.setQueryData(["collections"], (oldData: any) => {
        return {
          response: oldData.response.filter(
            (collection: any) => collection.id !== data.response.id
          ),
        };
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export {
  useCollections,
  useCreateCollection,
  useUpdateCollection,
  useDeleteCollection,
};
