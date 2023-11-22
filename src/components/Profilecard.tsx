import logo from "../img/logo.png";

interface CardProps {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  subjects?: object[];
  designation?: string;
  school?: string;
  course?: string;
  batch?: string;
  student?: boolean;
}

const Profilecard: React.FC<CardProps> = ({
  id,
  name,
  designation,
  school,
  email,
  subjects,
  student,
  phoneNumber,
}) => {
  return (
    <>
      <div className="flex flex-col gap-10 bg-gray-100 mx-auto my-auto pl-24 pr-24 pt-10 pb-10 h-full">
        <div className="max-w-lg mx-auto bg-[#e2f6fe] rounded-lg shadow-md p-5 w-64">
          <h4 className="text-center text-base mt-3">
            {student ? "Student" : "Employee"} Details:
          </h4>
          <img className="rounded-full mx-auto pl-10 pr-10 m-3" src={logo} />
          <h2 className="text-center text-xl font-semibold mt-3">{id}</h2>
          <h2 className="text-center text-2xl font-semibold">{name}</h2>
          <p className="text-center text-gray-600 mt-1">
            {student ? "" : designation + "," + school}
          </p>
          <div className="flex justify-center flex-col items-center mt-1 gap-1">
            <a
              href={`mailto:${email}`}
              className="text-blue-500 hover:text-blue-700 mx-3"
            >
              {email}
            </a>
            <p className="text-gray-600 mx-3">+91 {phoneNumber}</p>
          </div>
        </div>
        {subjects && (
          <div className="max-w-lg mx-auto bg-[#e2f6fe] rounded-lg shadow-md p-5 w-64">
            <h3 className="text-xl font-semibold">Subjects you teach:</h3>
            <div>
              {(
                subjects as {
                  subject_name: string;
                  subject_code: string;
                  subject_type: string;
                }[]
              ).map((subject, index) => (
                <div key={index}>
                  <li className="text-gray-600 mt-2">
                    {subject.subject_name}
                    {" - "}
                    {subject.subject_type}
                  </li>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profilecard;
