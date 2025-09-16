<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * api exams
 */

#[ORM\Entity]
#[ORM\Table(name: 'exam')]
#[ApiResource(
    uriTemplate: '/api/exams',
    operations: [
        new GetCollection(uriTemplate: '/api/exams', security: "is_granted('ROLE_USER')"),
        new Get(uriTemplate: '/api/exams/{id}', security: "is_granted('ROLE_USER')"),
        new Post(uriTemplate: '/api/exams', security: "is_granted('ROLE_USER')")
    ],
    normalizationContext: ['groups' => ['exam:read']],
    denormalizationContext: ['groups' => ['exam:write']]
)]
class Exam
{
    // available exam status
    public const STATUS_CONFIRMED = 'Confirmé';
    public const STATUS_TO_ORGANIZE = 'À organiser';
    public const STATUS_CANCELLED = 'Annulé';
    public const STATUS_SEARCHING_LOCATION = 'En recherche de place';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: Types::INTEGER)]
    #[Groups(['exam:read'])]
    private ?int $id = null;

    #[ORM\Column(type: Types::STRING, length: 255)]
    #[Assert\NotBlank(message: 'Le nom de l\'étudiant est requis')]
    #[Assert\Length(
        max: 255,
        maxMessage: 'Le nom de l\'étudiant ne peut pas dépasser {{ limit }} caractères'
    )]
    #[Groups(['exam:read', 'exam:write'])]
    private ?string $studentName = null;

    #[ORM\Column(type: Types::STRING, length: 255, nullable: true)]
    #[Assert\Length(
        max: 255,
        maxMessage: 'Le lieu ne peut pas dépasser {{ limit }} caractères'
    )]
    #[Groups(['exam:read', 'exam:write'])]
    private ?string $location = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    #[Assert\Type(type: \DateTimeInterface::class, message: 'La date doit être valide')]
    #[Groups(['exam:read', 'exam:write'])]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column(type: Types::STRING, length: 8, nullable: true)]
    #[Assert\Regex(pattern: '/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/', message: 'L\'heure doit être au format HH:MM')]
    #[Groups(['exam:read', 'exam:write'])]
    private ?string $time = null;

    #[ORM\Column(type: Types::STRING, length: 50)]
    #[Assert\NotBlank(message: 'Le statut est requis')]
    #[Assert\Choice(
        choices: [
            self::STATUS_CONFIRMED,
            self::STATUS_TO_ORGANIZE,
            self::STATUS_CANCELLED,
            self::STATUS_SEARCHING_LOCATION
        ],
        message: 'Le statut doit être l\'une des valeurs suivantes: {{ choices }}'
    )]
    #[Groups(['exam:read', 'exam:write'])]
    private ?string $status = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStudentName(): ?string
    {
        return $this->studentName;
    }

    public function setStudentName(string $studentName): static
    {
        $this->studentName = $studentName;
        return $this;
    }

    public function getLocation(): ?string
    {
        return $this->location;
    }

    public function setLocation(?string $location): static
    {
        $this->location = $location;
        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): static
    {
        $this->date = $date;
        return $this;
    }

    public function getTime(): ?string
    {
        return $this->time;
    }

    public function setTime(string $time): static
    {
        $this->time = $time;
        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;
        return $this;
    }

    /**
     * get status
     */
    public static function getAvailableStatuses(): array
    {
        return [
            self::STATUS_CONFIRMED,
            self::STATUS_TO_ORGANIZE,
            self::STATUS_CANCELLED,
            self::STATUS_SEARCHING_LOCATION
        ];
    }
}