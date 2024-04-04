package com.drivingschool.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * A Student.
 */
@Entity
@Table(name = "student")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Student extends AbstractAuditingEntity<Long> implements  Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "middle_name")
    private String middleName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "contract_number")
    private String contractNumber;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "jmbg")
    private String jmbg;

    @Column(name = "date_of_birth")
    private ZonedDateTime dateOfBirth;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "student")
    @JsonIgnoreProperties(value = { "student" }, allowSetters = true)
    private Set<Payment> payments = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "student")
    @JsonIgnoreProperties(value = { "student" }, allowSetters = true)
    private Set<Lesson> lessons = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "student")
    @JsonIgnoreProperties(value = { "student" }, allowSetters = true)
    private Set<Assurance> assurances = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "student")
    @JsonIgnoreProperties(value = { "student" }, allowSetters = true)
    private Set<Exam> exams = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "student")
    @JsonIgnoreProperties(value = { "student" }, allowSetters = true)
    private Set<Discount> discounts = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "student")
    @JsonIgnoreProperties(value = { "student" }, allowSetters = true)
    private Set<Documents> documents = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Student id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public Student firstName(String firstName) {
        this.setFirstName(firstName);
        return this;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getMiddleName() {
        return this.middleName;
    }

    public Student middleName(String middleName) {
        this.setMiddleName(middleName);
        return this;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public Student lastName(String lastName) {
        this.setLastName(lastName);
        return this;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getContractNumber() {
        return this.contractNumber;
    }

    public Student contractNumber(String contractNumber) {
        this.setContractNumber(contractNumber);
        return this;
    }

    public void setContractNumber(String contractNumber) {
        this.contractNumber = contractNumber;
    }

    public String getPhoneNumber() {
        return this.phoneNumber;
    }

    public Student phoneNumber(String phoneNumber) {
        this.setPhoneNumber(phoneNumber);
        return this;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getJmbg() {
        return this.jmbg;
    }

    public Student jmbg(String jmbg) {
        this.setJmbg(jmbg);
        return this;
    }

    public void setJmbg(String jmbg) {
        this.jmbg = jmbg;
    }

    public ZonedDateTime getDateOfBirth() {
        return this.dateOfBirth;
    }

    public Student dateOfBirth(ZonedDateTime dateOfBirth) {
        this.setDateOfBirth(dateOfBirth);
        return this;
    }

    public void setDateOfBirth(ZonedDateTime dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public Set<Payment> getPayments() {
        return this.payments;
    }

    public void setPayments(Set<Payment> payments) {
        if (this.payments != null) {
            this.payments.forEach(i -> i.setStudent(null));
        }
        if (payments != null) {
            payments.forEach(i -> i.setStudent(this));
        }
        this.payments = payments;
    }

    public Student payments(Set<Payment> payments) {
        this.setPayments(payments);
        return this;
    }

    public Student addPayment(Payment payment) {
        this.payments.add(payment);
        payment.setStudent(this);
        return this;
    }

    public Student removePayment(Payment payment) {
        this.payments.remove(payment);
        payment.setStudent(null);
        return this;
    }

    public Set<Lesson> getLessons() {
        return this.lessons;
    }

    public void setLessons(Set<Lesson> lessons) {
        if (this.lessons != null) {
            this.lessons.forEach(i -> i.setStudent(null));
        }
        if (lessons != null) {
            lessons.forEach(i -> i.setStudent(this));
        }
        this.lessons = lessons;
    }

    public Student lessons(Set<Lesson> lessons) {
        this.setLessons(lessons);
        return this;
    }

    public Student addLesson(Lesson lesson) {
        this.lessons.add(lesson);
        lesson.setStudent(this);
        return this;
    }

    public Student removeLesson(Lesson lesson) {
        this.lessons.remove(lesson);
        lesson.setStudent(null);
        return this;
    }

    public Set<Assurance> getAssurances() {
        return this.assurances;
    }

    public void setAssurances(Set<Assurance> assurances) {
        if (this.assurances != null) {
            this.assurances.forEach(i -> i.setStudent(null));
        }
        if (assurances != null) {
            assurances.forEach(i -> i.setStudent(this));
        }
        this.assurances = assurances;
    }

    public Student assurances(Set<Assurance> assurances) {
        this.setAssurances(assurances);
        return this;
    }

    public Student addAssurance(Assurance assurance) {
        this.assurances.add(assurance);
        assurance.setStudent(this);
        return this;
    }

    public Student removeAssurance(Assurance assurance) {
        this.assurances.remove(assurance);
        assurance.setStudent(null);
        return this;
    }

    public Set<Exam> getExams() {
        return this.exams;
    }

    public void setExams(Set<Exam> exams) {
        if (this.exams != null) {
            this.exams.forEach(i -> i.setStudent(null));
        }
        if (exams != null) {
            exams.forEach(i -> i.setStudent(this));
        }
        this.exams = exams;
    }

    public Student exams(Set<Exam> exams) {
        this.setExams(exams);
        return this;
    }

    public Student addExam(Exam exam) {
        this.exams.add(exam);
        exam.setStudent(this);
        return this;
    }

    public Student removeExam(Exam exam) {
        this.exams.remove(exam);
        exam.setStudent(null);
        return this;
    }

    public Set<Discount> getDiscounts() {
        return this.discounts;
    }

    public void setDiscounts(Set<Discount> discounts) {
        if (this.discounts != null) {
            this.discounts.forEach(i -> i.setStudent(null));
        }
        if (discounts != null) {
            discounts.forEach(i -> i.setStudent(this));
        }
        this.discounts = discounts;
    }

    public Student discounts(Set<Discount> discounts) {
        this.setDiscounts(discounts);
        return this;
    }

    public Student addDiscount(Discount discount) {
        this.discounts.add(discount);
        discount.setStudent(this);
        return this;
    }

    public Student removeDiscount(Discount discount) {
        this.discounts.remove(discount);
        discount.setStudent(null);
        return this;
    }

    public Set<Documents> getDocuments() {
        return this.documents;
    }

    public void setDocuments(Set<Documents> documents) {
        if (this.documents != null) {
            this.documents.forEach(i -> i.setStudent(null));
        }
        if (documents != null) {
            documents.forEach(i -> i.setStudent(this));
        }
        this.documents = documents;
    }

    public Student documents(Set<Documents> documents) {
        this.setDocuments(documents);
        return this;
    }

    public Student addDocuments(Documents documents) {
        this.documents.add(documents);
        documents.setStudent(this);
        return this;
    }

    public Student removeDocuments(Documents documents) {
        this.documents.remove(documents);
        documents.setStudent(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Student)) {
            return false;
        }
        return getId() != null && getId().equals(((Student) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Student{" +
            "id=" + getId() +
            ", firstName='" + getFirstName() + "'" +
            ", middleName='" + getMiddleName() + "'" +
            ", lastName='" + getLastName() + "'" +
            ", contractNumber='" + getContractNumber() + "'" +
            ", phoneNumber='" + getPhoneNumber() + "'" +
            ", jmbg='" + getJmbg() + "'" +
            ", dateOfBirth='" + getDateOfBirth() + "'" +
            "}";
    }
}
