from rest_framework import serializers
from .models import GameResult


class GameResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameResult
        fields = ["id", "player_name", "attempts", "result", "created_at"]
