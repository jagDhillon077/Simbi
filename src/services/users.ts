import qs from 'qs';
import HttpService from '.';
import { User } from '../react/Data';

export interface UserParams {
  username?: string;
  password?: string;
}

export default class UserService {
  static login(data: object) {
    return HttpService.post<User>(`/users/login`, data);
  }

  static signUp(data: object) {
    return HttpService.post<User>(`/users/user`, data);
  }

  static sendUsername(data: object) {
    return HttpService.post<string>(`/users/sendUsername`, data);
  }

  static sendCredentials(data: object) {
    return HttpService.post<string>(`/users/sendCredentials`, data);
  }

  static recoverUsername(data: object) {
    return HttpService.post<string>(`/users/recoverUsername`, data);
  }

  static verifyAnwser(data: object) {
    return HttpService.post<boolean>(`/users/verifyAnwser`, data);
  }

  static passwordCheck(data: object) {
    return HttpService.post<boolean>(`/users/passwordCheck`, data);
  }

  static resetPassword(data: object) {
    return HttpService.post<boolean>(`/users/resetPassword`, data);
  }

  static extendSession(data: object) {
    return HttpService.post(`/users/extendSession`, data);
  }
  
  static getSessionExpireTime(token: string) {
    return HttpService.get<number>(`/users/sessionTime/${token}`);
  }

  static getUser(token: string) {
    return HttpService.get<User>(`/users/${token}`);
  }

  static validateUser(token: string) {
    return HttpService.get<User>(`/users/validate/${token}`);
  }

  static getUserList() {
    return HttpService.get<User>(`/users/fullList`); 
  }

  static logout(token: string) {
    return HttpService.delete(`/users/${token}`);
  }

  static deleteUser(id: number) {
    return HttpService.delete(`/users/adminDelete/${id}`);
  }

  static updateUserPassword(data: object) {
    return HttpService.patch(`/users/adminChangePassword`, data)
  }

  static updateUserName(data: User) {
    return HttpService.patch<User>(`/users/userChangeName`, data)
  }

  static userUpdateUserPassword(data: object) {
    console.log(`Data: ${data}`)
    return HttpService.patch<string>(`/users/userChangePasswordCredentials`, data)
  }

  static updateSecurityCredentials(data: User) {
    return HttpService.patch<User>(`/users/userChangeSecurityCredentials`, data)
  }

  static setOnboardingDone (data: object) {
    return HttpService.patch<User>(`/users/setOnboardingDone`, data)
  }

  static getNotifications(id: number) {
    return HttpService.get<User>(`/users/getNotifications/${id}`);
  }

  static sendNotificationUser(notification: object) {
    return HttpService.post<User>(`/users/sendNotificationUser`, notification);
  }

  static sendNotificationAdmin(notification: object) {
    return HttpService.post<string>(`/users/sendNotificationAdmin`, notification);
  }

  static read(data: object) {
    return HttpService.post<User>(`/users/read`, data);
  }

  static deleteNotification(id: number) {
    return HttpService.delete(`/users/notificationDelete/${id}`);
  }

  static deleteOldNotifications() {
    const id = 1;
    return HttpService.delete(`/users/deleteOldContent/${id}`);
  }
}