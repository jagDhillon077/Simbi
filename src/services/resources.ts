import qs from 'qs';
import HttpService from '.';
import { Resource } from '../react/Data';

export interface ListResourceParams {
  name?: string;
  grades?: string[];
  offset?: number;
  limit?: number;
  firstName?: string;
  username?: string;
  isPublic?: boolean;
  approved?: boolean;
}

export interface ListResourceResponse {
  resources: Resource[];
  count: number;
}

const RESOURCE_PAGE_LIMIT = 10;

export default class ResourceService {
  // Create/POST is done with XMLHttpRequest for progress events

  static create(payload: Partial<Resource>) {
    return HttpService.post<Resource>(`/resources`, payload);
  }

  static list(params: ListResourceParams) {
    return HttpService.get<ListResourceResponse>(`/resources?${qs.stringify({
      ...params,
      limit: params.limit ?? RESOURCE_PAGE_LIMIT,
    })}`);
  }

  static update(id: number, resource: Partial<Resource>) {
    return HttpService.patch<Resource>(`/resources/${id}`, resource);
  }

  static delete(id: number) {
    return HttpService.delete(`/resources/${id}`);
  }
}
