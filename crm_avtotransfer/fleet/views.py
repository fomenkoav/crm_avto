from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from .models import Vehicle
from .serializers import (
    VehicleSerializer,
    VehicleCreateSerializer,
    VehicleDetailSerializer,
    VehicleStatusSerializer
)
from .filters import VehicleFilter


class VehicleViewSet(viewsets.ModelViewSet):
    """
    ViewSet для управління транспортними засобами з підтримкою:
    - Фільтрації по типу, паливу, доступності
    - Пошуку по марці, моделі, номеру
    - Кастомних ендпоінтів для роботи з техобслуговуванням
    """
    queryset = Vehicle.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = VehicleFilter
    search_fields = ['make', 'model', 'license_plate']
    ordering_fields = ['year', 'purchase_date', 'mileage']
    ordering = ['-purchase_date']

    def get_serializer_class(self):
        if self.action == 'create':
            return VehicleCreateSerializer
        elif self.action == 'retrieve':
            return VehicleDetailSerializer
        elif self.action in ['update_status', 'mark_maintenance']:
            return VehicleStatusSerializer
        return VehicleSerializer

    @action(detail=False, methods=['get'])
    def available(self, request):
        """Список доступних транспортних засобів"""
        queryset = self.filter_queryset(
            self.get_queryset().filter(is_available=True)
        )
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'], url_path='update-status')
    def update_status(self, request, pk=None):
        """Оновлення статусу доступності транспорту"""
        vehicle = self.get_object()
        serializer = self.get_serializer(vehicle, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=True, methods=['patch'], url_path='mark-maintenance')
    def mark_maintenance(self, request, pk=None):
        """Позначка про проходження ТО"""
        vehicle = self.get_object()
        vehicle.last_maintenance = timezone.now().date()
        vehicle.is_available = False
        vehicle.save()
        return Response(
            {
                'status': 'success',
                'last_maintenance': vehicle.last_maintenance,
                'is_available': vehicle.is_available
            },
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'], url_path='by-type/(?P<type>[^/.]+)')
    def by_type(self, request, type=None):
        """Фільтрація транспорту за типом"""
        queryset = self.filter_queryset(
            self.get_queryset().filter(vehicle_type=type)
        )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def perform_destroy(self, instance):
        """М'яке видалення (позначка як недоступний)"""
        instance.is_available = False
        instance.save()