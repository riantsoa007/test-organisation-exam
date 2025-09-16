<?php

namespace App\DataFixtures;

use App\Entity\Exam;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

/**
 * Load sample exam data matching the screenshots
 */
class ExamFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        // Sample data matching the screenshot
        $exams = [
            [
                'studentName' => 'Franziska.S',
                'location' => 'Martigues-B',
                'date' => '2024-06-16',
                'time' => '14:00',
                'status' => 'Confirmé'
            ],
            [
                'studentName' => 'Lucas.R',
                'location' => 'Martigues-B',
                'date' => '2024-06-21',
                'time' => '17:00',
                'status' => 'À organiser'
            ],
            [
                'studentName' => 'Léo.C',
                'location' => 'Martigues-B',
                'date' => '2024-05-26',
                'time' => '13:00',
                'status' => 'Annulé'
            ],
            [
                'studentName' => 'Isabella.S',
                'location' => null,
                'date' => null,
                'time' => null,
                'status' => 'En recherche de place'
            ],
            [
                'studentName' => 'Raphaël.B',
                'location' => null,
                'date' => null,
                'time' => null,
                'status' => 'En recherche de place'
            ],
            [
                'studentName' => 'Thibault.V',
                'location' => null,
                'date' => null,
                'time' => null,
                'status' => 'En recherche de place'
            ],
            [
                'studentName' => 'Olivia.J',
                'location' => null,
                'date' => '2024-06-16',
                'time' => null,
                'status' => 'Annulé'
            ]
        ];

        foreach ($exams as $examData) {
            $exam = new Exam();
            $exam->setStudentName($examData['studentName']);
            $exam->setLocation($examData['location']);
            $exam->setStatus($examData['status']);

            if ($examData['date']) {
                $exam->setDate(new \DateTime($examData['date']));
            }

            if ($examData['time']) {
                $exam->setTime($examData['time']);
            }

            $manager->persist($exam);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [UserFixtures::class];
    }
}