export async function get(
    base, 
    url, 
    header = {}, 
    params = {}
) {
    const queryString = new URLSearchParams(params).toString();
    const url_request = `${base}${url}?${queryString}`;

    return await fetch(url_request, {
        method: 'GET',
        headers: header
    })
}

export async function post(
  base,
  url,
  header = {},
  body = {}
) {
  const url_request = `${base}${url}`;

  return await fetch(url_request, {
    method: 'POST',
    headers: header,
    body: JSON.stringify(body)
  });
}