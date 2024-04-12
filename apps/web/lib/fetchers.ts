import { cache } from "react";
import { getSession } from "./auth";
import prisma from "./prisma";

export const getWorkspaces = cache(async () => {
  try {
    const session = await getSession();
    if (!session) {
      return null;
    }
    const workspaces = await prisma.project.findMany({
      where: {
        users: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        domains: true,
        users: true,
      },
    });

    return workspaces;
  } catch (error) {
    console.error("Error fetching workspaces:", error);
  }
});

export const getWorkspace = cache(async ({ slug }: { slug: string }) => {
  try {
    const session = await getSession();
    if (!session) {
      return null;
    }
    return await prisma.project.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        usage: true,
        usageLimit: true,
        plan: true,
        stripeId: true,
        billingCycleStart: true,
        createdAt: true,
        users: {
          where: {
            userId: session.user.id,
          },
          select: {
            role: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching workspace:", error);
  }
});

export const getLink = cache(
  async ({ domain, key }: { domain: string; key: string }) => {
    try {
      return await prisma.link.findUnique({
        where: {
          domain_key: {
            domain,
            key,
          },
        },
      });
    } catch (error) {
      console.error("Error fetching link:", error);
    }
  },
);
