import { IModLoaderAPI, ModLoaderEvents } from 'modloader64_api/IModLoaderAPI';
import { bus, EventHandler } from 'modloader64_api/EventHandler';
import { IWWCore } from 'WindWaker/API/WWAPI';
import { WWOnlineStorageClient } from '@WindWakerOnline/WWOnlineStorageClient';

const actor = 0x0000
const anim_data = 0x0144

export class PuppetData {
  pointer: number;
  ModLoader: IModLoaderAPI;
  core: IWWCore;
  time: number = 0;
  private readonly copyFields: string[] = new Array<string>();
  private storage: WWOnlineStorageClient;

  constructor(
    pointer: number,
    ModLoader: IModLoaderAPI,
    core: IWWCore,
    storage: WWOnlineStorageClient
  ) {
    this.storage = storage;
    this.pointer = pointer;
    this.ModLoader = ModLoader;
    this.core = core;
    this.copyFields.push('pos');
    this.copyFields.push('rot');

  }

  get pos(): Buffer {
    return this.core.link.pos;
  }

  set pos(pos: Buffer) {
    this.ModLoader.emulator.rdramWriteBuffer(this.pointer + 0x1F8, pos);
  }

  get rot(): Buffer {
    return this.core.link.rot;
  }

  set rot(rot: Buffer) {
    this.ModLoader.emulator.rdramWriteBuffer(this.pointer + 0x1DC, rot);
    this.ModLoader.emulator.rdramWriteBuffer(this.pointer + 0x1F0, rot);
    this.ModLoader.emulator.rdramWriteBuffer(this.pointer + 0x204, rot);
    this.ModLoader.emulator.rdramWriteBuffer(this.pointer + 0x20C, rot);
  }

  toJSON() {
    const jsonObj: any = {};

    for (let i = 0; i < this.copyFields.length; i++) {
      jsonObj[this.copyFields[i]] = (this as any)[this.copyFields[i]];
    }
    return jsonObj;
  }
}