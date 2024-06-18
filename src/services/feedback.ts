import qs from 'qs';
import HttpService from '.';
import { Feedback } from '../react/Data';



export default class FeedbackService {
  static submit(data: object) {
    return HttpService.post<Feedback>(`/feedback/submit`, data);
  }

  static getResponseList() {
    return HttpService.get<Feedback>(`/feedback/getResponses`);
  }

  static getNewResCount() {
    return HttpService.get<number>(`/feedback/getUndownloadedResponses`);
  }

  static getResponceExists() {
    return HttpService.get<boolean>(`/feedback/checkCount`);
  }

  static deleteResponse(id: number) {
    return HttpService.delete(`/feedback/${id}`)
  }

  static deleteOldFeedback() {
    const id = 2;
    return HttpService.delete(`/feedback/deleteOldContent/${id}`);
  }
}