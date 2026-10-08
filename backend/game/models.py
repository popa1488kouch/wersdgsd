from django.db import models


class GameResult(models.Model):
    RESULT_CHOICES = [("win", "win"), ("lose", "lose")]

    player_name = models.CharField(max_length=100)
    attempts = models.PositiveIntegerField()
    result = models.CharField(max_length=4, choices=RESULT_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.player_name}: {self.result} ({self.attempts})"
