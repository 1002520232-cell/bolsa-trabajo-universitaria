import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Firestore, collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc, orderBy } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { user } from '@angular/fire/auth';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {
    this.initializeNotificationsListener();
  }

  private initializeNotificationsListener() {
    user(this.auth).subscribe(currentUser => {
      if (currentUser) {
        const notificationsRef = collection(this.firestore, 'notifications');
        const q = query(
          notificationsRef,
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );

        onSnapshot(q, (snapshot) => {
          const notifications: Notification[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            notifications.push({
              id: doc.id,
              ...data,
              createdAt: data['createdAt']?.toDate() || new Date()
            } as Notification);
          });
          this.notificationsSubject.next(notifications);
        });
      } else {
        this.notificationsSubject.next([]);
      }
    });
  }

  async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<void> {
    try {
      const notificationsRef = collection(this.firestore, 'notifications');
      await addDoc(notificationsRef, {
        ...notification,
        createdAt: new Date()
      });
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(this.firestore, 'notifications', notificationId);
      await updateDoc(notificationRef, { read: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      const currentNotifications = this.notificationsSubject.value;
      const unreadNotifications = currentNotifications.filter(n => !n.read);

      const updatePromises = unreadNotifications.map(notification =>
        updateDoc(doc(this.firestore, 'notifications', notification.id), { read: true })
      );

      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  async removeNotification(notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(this.firestore, 'notifications', notificationId);
      await deleteDoc(notificationRef);
    } catch (error) {
      console.error('Error removing notification:', error);
      throw error;
    }
  }

  getUnreadCount(): Observable<number> {
    return new Observable<number>(observer => {
      this.notifications$.subscribe(notifications => {
        const unreadCount = notifications.filter(n => !n.read).length;
        observer.next(unreadCount);
      });
    });
  }
}
