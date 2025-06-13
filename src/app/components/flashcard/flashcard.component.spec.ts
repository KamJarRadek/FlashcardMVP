import { TestBed } from '@angular/core/testing';
import { FlashcardComponent } from './flashcard.component';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

describe('FlashcardComponent', () => {
  let component: FlashcardComponent;
  let fixture: ComponentFixture<FlashcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlashcardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FlashcardComponent);
    component = fixture.componentInstance;
    component.question = 'What is Angular?';
    component.answer = 'A framework for building web applications.';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display the answer initially', () => {
    const answerElement = fixture.debugElement.query(By.css('.answer'));
    expect(answerElement).toBeNull();
  });


  it('should hide the answer after toggleAnswer is called twice', () => {
    component.toggleAnswer();
    fixture.detectChanges();
    component.toggleAnswer();
    fixture.detectChanges();

    const answerElement = fixture.debugElement.query(By.css('.answer'));
    expect(answerElement).toBeNull();
  });
});
