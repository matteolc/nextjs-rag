export const chatAction = async (formData: FormData) => {
  const question = formData.get("question");
  const history = formData.get("history");
  const workspace = formData.get("workspace");
  const profileId = formData.get("profile_id");
  const service = formData.get("service");

  console.log(question, history, workspace, profileId, service);

  return {
    question,
    history,
    workspace,
    profileId,
    service,
  };
};
