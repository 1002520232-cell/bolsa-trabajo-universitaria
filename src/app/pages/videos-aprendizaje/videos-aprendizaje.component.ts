import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Video {
  id: number;
  title: string;
  thumbnail: string;
  url: string;
  platform: 'tiktok' | 'youtube';
}

@Component({
  selector: 'app-videos-aprendizaje',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './videos-aprendizaje.component.html',
  styleUrl: './videos-aprendizaje.component.css'
})
export class VideosAprendizajeComponent {
  videos: Video[] = [
    {
      id: 1,
      title: 'motivacion',
      thumbnail: 'https://i.pinimg.com/736x/ff/0c/f4/ff0cf4791a7d289329e2ed3800c77172.jpg',
      url: 'https://youtu.be/fTEab-LUGZw?si=joTJIBC504NxiipK',
      platform: 'youtube'
    },
    {
      id: 2,
      title: 'motivacion al fallo',
      thumbnail: 'https://avatars.mds.yandex.net/i?id=b44fd21168c2f7a6dd0b3cde4f0e3b29fcfd34f7-12622473-images-thumbs&n=13',
      url: 'https://www.tiktok.com/@yuittadori/video/7573822509326372114?is_from_webapp=1&sender_device=pc&web_id=7553003878162892296',
      platform: 'tiktok'
    },
    {
      id: 3,
      title: 'que vas hacer ee',
      thumbnail: 'https://a.d-cd.net/5baa981s-1920.jpg',
      url: 'https://youtu.be/OhkswQxFQ0k?si=CHJVo9W_bP-6bncw',
      platform: 'youtube'
    },
    {
      id: 4,
      title: 'Habilidades Blandas en el Trabajo',
      thumbnail: 'https://avatars.mds.yandex.net/i?id=3898d815a658f1d26d788c95a44c7b8bf1bc00c8-8519693-images-thumbs&n=13',
      url: 'https://www.tiktok.com/@espacio_psicope/video/7494788034034994487?is_from_webapp=1&sender_device=pc&web_id=7553003878162892296',
      platform: 'tiktok'
    },
    {
      id: 5,
      title: 'Gestión del Tiempo',
      thumbnail: 'https://preview.redd.it/whenever-someone-new-plays-yba-we-should-just-fill-the-v0-1uop53ancoxf1.jpeg?width=1080&crop=smart&auto=webp&s=11f5deab8b74c854b9f4d5ce157510399ab36d6f',
      url: 'https://youtube.com/shorts/ymmJ7GFWBew?si=UKt2_88L4yzLG9gE',
      platform: 'youtube'
    },
    {
      id: 6,
      title: 'Networking Profesional',
      thumbnail: 'https://d1ih8jugeo2m5m.cloudfront.net/2025/01/networking_que_es.webp',
      url: 'https://www.tiktok.com/@nixonnetworkmarketing/video/7524120317325872440?is_from_webapp=1&sender_device=pc&web_id=7553003878162892296',
      platform: 'tiktok'
    }
  ];

  openVideo(video: Video): void {
    window.open(video.url, '_blank');
  }

  trackByVideoId(index: number, video: Video): number {
    return video.id;
  }
}
