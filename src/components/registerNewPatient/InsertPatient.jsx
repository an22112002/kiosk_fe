import InputForm from "./InputForm"

export default function InsertPatient({ patientInfo, onBack }) {

    return (
        <>
            <div className="transition-all duration-300">
                {/* Tiêu đề */}
                <div className="px-7 py-4">
                    <h1 className="mb-5 text-colorOne font-bold text-[25px] lg:text-[26px]">
                        Xin vui lòng bổ sung thêm thông tin hồ sơ bệnh viện
                    </h1>
                </div>

                {/* Form */}
                <div className="flex justify-center mb-10">
                    <div className="flex w-full gap-2">
                        <InputForm patientInfo={patientInfo} onBack={onBack} />
                    </div>
                </div>
            </div>
        </>
    )
}