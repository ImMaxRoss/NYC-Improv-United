
## Repository Structure for Phase 1

### NEW Classes to be Added

```
src/main/java/com/phas1/
├── model/
│   ├── Lesson.java                    [NEW]
│   ├── Exercise.java                  [NEW]
│   ├── LessonExercise.java           [NEW]
│   ├── FocusArea.java                [NEW]
│   └── Performer.java                 [NEW]
│
├── repository/
│   ├── LessonRepository.java          [NEW]
│   ├── ExerciseRepository.java        [NEW]
│   ├── LessonExerciseRepository.java  [NEW]
│   ├── FocusAreaRepository.java       [NEW]
│   └── PerformerRepository.java       [NEW]
│
├── dto/
│   ├── lesson/
│   │   ├── LessonRequest.java        [NEW]
│   │   ├── LessonResponse.java       [NEW]
│   │   ├── LessonUpdateRequest.java  [NEW]
│   │   └── CreateFromTemplateRequest.java [NEW]
│   │
│   ├── exercise/
│   │   ├── ExerciseRequest.java      [NEW]
│   │   ├── ExerciseResponse.java     [NEW]
│   │   ├── ExerciseSearchRequest.java [NEW]
│   │   └── ExerciseSummaryResponse.java [NEW]
│   │
│   ├── performer/
│   │   ├── PerformerRequest.java     [NEW]
│   │   └── PerformerResponse.java    [NEW]
│   │
│   └── common/
│       ├── FocusAreaResponse.java    [NEW]
│       └── TimeBreakdownResponse.java [NEW]
│
├── service/
│   ├── LessonService.java            [NEW]
│   ├── ExerciseService.java          [NEW]
│   ├── FocusAreaService.java         [NEW]
│   └── PerformerService.java         [NEW]
│
├── controller/
│   ├── LessonController.java         [NEW]
│   ├── ExerciseController.java       [NEW]
│   ├── FocusAreaController.java      [NEW]
│   └── PerformerController.java      [NEW]
│
└── util/
    ├── LessonNameGenerator.java      [NEW]
    └── TimeCalculator.java           [NEW]
```

### EXISTING Classes Requiring Updates

```
src/main/java/com/phas1/
├── model/
│   ├── Team.java                     [UPDATE: Add performers relationship]
│   └── Coach.java                    [UPDATE: Add lessons relationship]
│
├── repository/
│   └── TeamRepository.java           [UPDATE: Add performer-related queries]
│
├── dto/
│   ├── TeamResponse.java             [UPDATE: Add performer count]
│   └── TeamUpdateRequest.java        [UPDATE: Add performer management]
│
├── service/
│   └── TeamService.java              [UPDATE: Add performer management methods]
│
├── controller/
│   └── TeamController.java           [UPDATE: Add performer endpoints]
│
└── config/
    └── SecurityConfig.java           [UPDATE: Add new endpoint permissions]
```

## Phase 1 Development Procedure

### Week 1: Foundation & Data Model (Days 1-5)

#### Day 1: Core Entities
**Morning:**
- [x] 1. Create `FocusArea.java` entity 
- [x] 2. Create `FocusAreaRepository.java`
- [x] 3. Create `FocusAreaService.java` with basic CRUD
- [x] 4. Create database migration script for focus_areas table
- [x] 5. Seed default focus areas

- [x] 6. Create `Performer.java` entity
- [x] 7. Create `PerformerRepository.java`
- [x] 8. Update `Team.java` to add performer relationship
- [x] 9. Create database migrations for all new tables
- [x] 10. Create `Exercise.java` entity
- [x] 11. Create `Lesson.java` entity
- [x] 12. 2. Create `LessonExercise.java` junction entity

**Afternoon:**
1. Create `ExerciseRepository.java`
3. Create `LessonRepository.java` repository
3. Create `LessonExerciseRepository.java` repository


#### Day 3: Service Layer Foundation
**Morning:**
1. Create `ExerciseService.java` with:
   - `createExercise()`
   - `findById()`
   - `searchExercises()`
   - `seedDefaultExercises()` method

**Afternoon:**
1. Create `LessonService.java` with:
   - `createLesson()`
   - `updateLesson()`
   - `getUpcomingLessons()`
   - `calculateTotalDuration()`

#### Day 4: DTOs and Mappers
**Morning:**
1. Create all Exercise DTOs:
   - `ExerciseRequest.java`
   - `ExerciseResponse.java`
   - `ExerciseSummaryResponse.java`

**Afternoon:**
1. Create all Lesson DTOs:
   - `LessonRequest.java`
   - `LessonResponse.java`
   - `TimeBreakdownResponse.java`

#### Day 5: Controllers & Initial Testing
**Morning:**
1. Create `ExerciseController.java` with basic endpoints
2. Create `LessonController.java` with create/read endpoints

**Afternoon:**
1. Update `SecurityConfig.java` for new endpoints
2. Test all endpoints with Postman/Swagger
3. Fix any integration issues

### Week 2: Advanced Features (Days 6-10)

#### Day 6: Template System
**Morning:**
1. Add template functionality to `LessonService.java`:
   - `saveAsTemplate()`
   - `createFromTemplate()`
   - `getMyTemplates()`

**Afternoon:**
1. Add corresponding endpoints to `LessonController.java`
2. Create `CreateFromTemplateRequest.java` DTO

#### Day 7: Performer Management
**Morning:**
1. Create `PerformerService.java`
2. Create `PerformerController.java`
3. Update `TeamService.java` to handle performer assignments

**Afternoon:**
1. Add performer endpoints to `TeamController.java`
2. Test performer-team relationships

#### Day 8: Time Calculations & Utilities
**Morning:**
1. Create `TimeCalculator.java` utility class
2. Create `LessonNameGenerator.java` for auto-naming
3. Add time breakdown logic to `LessonService.java`

**Afternoon:**
1. Enhance `LessonResponse.java` with calculated fields
2. Add focus area time breakdown to responses

#### Day 9: Exercise Library Seeding
**Morning:**
1. Create SQL script with 20-30 core exercises
2. Create data initialization component
3. Test exercise search and filtering

**Afternoon:**
1. Add pagination to exercise search
2. Implement exercise sorting options

#### Day 10: Integration & Polish
**Morning:**
1. Add validation to all request DTOs
2. Improve error handling across services
3. Add logging to critical operations

**Afternoon:**
1. Create integration tests for main workflows
2. Update API documentation
3. Performance testing with sample data

### Week 3: Testing & Refinement (Days 11-15)

#### Days 11-12: Comprehensive Testing
- Unit tests for all services
- Integration tests for complex workflows
- Load testing for lesson creation

#### Days 13-14: Bug Fixes & Optimization
- Address issues found in testing
- Optimize database queries
- Add missing indexes

#### Day 15: Documentation & Deployment
- Update README with new features
- Create migration guide for existing users
- Deploy to staging environment

## Development Efficiency Tips

### 1. Parallel Development Strategy
- **Backend Dev 1**: Focus on entities and repositories (Days 1-2)
- **Backend Dev 2**: Work on services and business logic (Days 3-4)
- **Frontend Dev**: Start UI mockups while backend is in progress

### 2. Code Generation & Templates
```bash
# Create a template for similar classes
# Example: Generate all repositories from entities
for entity in Lesson Exercise LessonExercise FocusArea Performer; do
  echo "Creating ${entity}Repository..."
  # Use IDE templates or scripts
done
```

### 3. Testing Strategy
- Write repository tests first (they're quickest)
- Use @DataJpaTest for repository testing
- Use @MockBean for service tests
- Create test data builders for complex objects

### 4. Daily Sync Points
- Morning: Review yesterday's work, plan today
- Midday: Quick progress check
- End of day: Commit working code, update tasks

### 5. Prioritization Rules
1. **Must Have**: Basic lesson creation and viewing
2. **Should Have**: Templates, time calculations
3. **Nice to Have**: Advanced search, bulk operations

This structure ensures that each component builds on the previous one, minimizing rework and maximizing development efficiency.
