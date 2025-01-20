import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedComponentsService {
  private activeDropdownIdSource = new BehaviorSubject<string | null>(null); // Initial state is null
  activeDropdownId$ = this.activeDropdownIdSource.asObservable(); // Observable to listen to active dropdown

  constructor() { }

  setActiveDropdown(id: string | null): void {
    this.activeDropdownIdSource.next(id); // Emit the new active dropdown ID
  }

  getActiveDropdown(): string | null {
    return this.activeDropdownIdSource.getValue(); // Get the current active dropdown ID
  }

  isDropdownActive(id: string): boolean {
    const activeId = this.getActiveDropdown();
    return activeId === id;
  }
}
