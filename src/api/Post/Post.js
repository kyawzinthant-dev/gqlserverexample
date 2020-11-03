import { prisma } from "../../../generated/prisma-client";

export default {
  User: {
    fullName: (parent) => {
      return `${parent.firstName} ${parent.lastName}`;
    },
    isFollowing: async (parent, _, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { user } = request;
      const { id: parentId } = parent;
      try {
        const exists = await prisma.$exists.user({
          AND: [{ id: user.id }, { following_some: { id: parentId } }],
        });
        return exists;
      } catch (e) {
        return false;
      }
    },
    isSelf: (parent, _, { request }) => {
      const { user } = request;
      const { id: parentId } = parent;
      return user.id === parentId;
    },
  },
  Post: {
    isLiked: async (parent, _, { request }) => {
      const { user } = request;
      const { id } = parent;
      return prisma.$exists.like({
        AND: [
          {
            user: {
              id: user.id,
            },
          },
          {
            post: { id },
          },
        ],
      });
    },
    likeCount: (parent) =>
      prisma
        .likesConnection({
          where: {
            post: { id: parent.id },
          },
        })
        .aggregate()
        .count(),
    files: (parent) => prisma.post({ id: parent.id }).files(),
    comments: (parent) => prisma.post({ id: parent.id }).comments(),
    user: (parent) => prisma.post({ id: parent.id }).user(),
  },
};
