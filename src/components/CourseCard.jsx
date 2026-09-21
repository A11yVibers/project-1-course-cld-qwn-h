import { coursePath } from '../router.js'
import RemoteImage from './RemoteImage.jsx'
import Icon from './Icon.jsx'

export default function CourseCard({ course }) {
  return (
    <li className="course-card">
      <div className="course-card__media">
        <RemoteImage
          src={course.imageUrl}
          alt={`Cover image for ${course.name}`}
          className="course-card__image"
          fallbackLabel={course.id}
        />
        <span className="course-card__code">{course.id}</span>
        {course.materialCount > 0 && (
          <span className="course-card__materials-badge">
            <Icon name="fileText" size={13} /> {course.materialCount} materials posted
          </span>
        )}
      </div>
      <div className="course-card__body">
        <h3 className="course-card__title">
          <a href={coursePath(course.id)} className="course-card__link">
            {course.name}
          </a>
        </h3>
        <p className="course-card__desc">{course.shortDescription}</p>
      </div>
      <div className="course-card__footer">
        <p className="course-card__meta">
          <span>
            <Icon name="calendar" size={14} /> {course.numberOfWeeks} weeks
          </span>
          <span>
            <Icon name="book" size={14} /> {course.numberOfClasses} classes
          </span>
        </p>
        {course.instructor && (
          <p className="course-card__instructor">
            <RemoteImage
              src={course.instructor.photoUrl}
              alt=""
              className="course-card__instructor-photo"
              fallbackLabel=""
            />
            <span>{course.instructor.name}</span>
          </p>
        )}
      </div>
    </li>
  )
}
