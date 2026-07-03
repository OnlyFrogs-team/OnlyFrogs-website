import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it, vi } from 'vite-plus/test';

import { ConsultPage } from './consult-page';

describe('ConsultPage', () => {
  it('renders as a local stub and never calls fetch when a question is submitted', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    await TestBed.configureTestingModule({
      imports: [ConsultPage],
    }).compileComponents();
    const fixture: ComponentFixture<ConsultPage> = TestBed.createComponent(ConsultPage);

    fixture.detectChanges();
    fixture.debugElement.queryAll(By.css('.personality-card'))[0].nativeElement.click();
    fixture.detectChanges();

    const textarea = fixture.debugElement.query(By.css('textarea'))
      .nativeElement as HTMLTextAreaElement;
    textarea.value = 'Will my frog prosper?';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    fixture.debugElement.query(By.css('.send-button')).nativeElement.click();
    fixture.detectChanges();

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('local consult stub');

    fetchSpy.mockRestore();
  });
});
