from rest_framework import viewsets
from .models import Order
from .serializers import (
    OrderCreateSerializer,
    OrderListSerializer,
    OrderDetailSerializer,
    OrderStatusUpdateSerializer
)

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        elif self.action == 'list':
            return OrderListSerializer
        elif self.action == 'retrieve':
            return OrderDetailSerializer
        elif self.action == 'partial_update':
            return OrderStatusUpdateSerializer
        return OrderCreateSerializer