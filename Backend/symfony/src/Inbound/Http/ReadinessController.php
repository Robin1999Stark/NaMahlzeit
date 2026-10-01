<?php

declare(strict_types=1);

namespace App\Inbound\Http;

use App\Application\Port\Inbound\Readiness;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final readonly class ReadinessController
{
    public function __construct(private Readiness $readiness)
    {
    }

    #[Route('/ready', name: 'ready', methods: ['GET'])]
    public function __invoke(): JsonResponse
    {
        return $this->readiness->isReady()
            ? new JsonResponse(['status' => 'ok'])
            : new JsonResponse(['status' => 'unavailable'], Response::HTTP_SERVICE_UNAVAILABLE);
    }
}
