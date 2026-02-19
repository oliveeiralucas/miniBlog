from slowapi import Limiter
from slowapi.util import get_remote_address

# Application-wide limiter instance.
# Decorate individual routes with @limiter.limit("N/period").
limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])
