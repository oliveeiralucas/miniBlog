from prisma import Prisma

# Single application-wide Prisma client instance.
# Connected/disconnected via FastAPI lifespan events in main.py.
prisma = Prisma()
