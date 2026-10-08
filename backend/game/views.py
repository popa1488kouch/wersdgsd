from rest_framework import generics
from .models import GameResult
from .serializers import GameResultSerializer


class GameResultListCreate(generics.ListCreateAPIView):
    queryset = GameResult.objects.order_by("-created_at")
    serializer_class = GameResultSerializer
