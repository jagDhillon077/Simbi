import qs from 'qs';
import HttpService from '.';
import { Module } from '../react/Data';

export interface ModuleListParams {
  search?: string;
  subject?: string;
  source?: string;
}

export interface ModuleListSubmodulesParams {
  path: string;
}

export default class ModuleService {
  static list(params: ModuleListParams) {
    return HttpService.get<Module[]>(`/modules?${qs.stringify(params)}`);
  }

  static listSubmodules(params: ModuleListSubmodulesParams) {
    return HttpService.get<Module[]>(`/modules/submodules?${qs.stringify(params)}`);
  }
}
